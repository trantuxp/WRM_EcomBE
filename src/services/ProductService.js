const Product = require("../models/ProductModel");
const Search = require("../models/SearchModel");
const Order = require("../models/OrderProduct");
const fs = require("fs");
const TfIdf = require("node-tfidf");

const unorm = require("unorm");
const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    // //console.log("newProduct", newProduct);

    const {
      name,
      image,
      type,
      countInStock,
      price,
      rating,
      description,
      discount,
      idstore,
    } = newProduct;

    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "ERR",
          message: "The name of product is already",
        });
        return;
      }
      const newProduct = await Product.create({
        name,
        image,
        type,
        countInStock: Number(countInStock),
        price,
        rating,
        description,
        discount: Number(discount),
        idstore,
      });
      if (newProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id,
      });
      if (product === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESS",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};
function searchStartsWith(query, dataArray) {
  const result = [];
  const queryNomaly = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const queryNomalylower = queryNomaly.toLowerCase();
  dataArray.map((value) => {
    // Chuẩn hóa văn bản có dấu thành không dấu
    const value1 = value.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const value2 = value1.toLowerCase();
    if (value2.includes(queryNomalylower)) {
      result.push(value);
    }
  });

  return result;
}

// Sử dụng hàm tìm kiếm

const getAllProductS = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();

      let allProduct = [];

      if (filter) {
        const label = filter[0];
        const regex = new RegExp(filter[1], "i");

        const TotalallObject = await Product.find();
        const TotalallObjectFilter = searchStartsWith(
          filter[1],
          TotalallObject
        );

        const allObjectFilter = TotalallObjectFilter.slice(
          (page - 1) * limit,
          page * limit
        ) // Limit and skip
          .sort(
            (a, b) => b.createdAt - a.createdAt || b.updatedAt - a.updatedAt
          ); // Sort by createdAt and updatedAt
        console.log("allObjectFilter:", allObjectFilter, page, limit);

        const totalProductFilter = TotalallObjectFilter.length;
        if (page && limit) {
          resolve({
            status: "OK",
            message: "Success",
            data: allObjectFilter,
            total: totalProductFilter,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalProductFilter / limit),
          });
        }
        resolve({
          status: "OK",
          message: "Success",
          data: TotalallObjectFilter,
          total: totalProductFilter,
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allProductSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: "OK",
          message: "Success",
          data: allProductSort,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      if (!limit) {
        allProduct = await Product.find().sort({
          createdAt: -1,
          updatedAt: -1,
        });
      } else {
        allProduct = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: allProduct,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");
      resolve({
        status: "OK",
        message: "Success",
        data: allType,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const removeDuplicateObjects = (arrayOfObjects) => {
  const uniqueData = Object.values(
    arrayOfObjects.reduce((acc, obj) => {
      acc[obj._id] = acc[obj._id] || obj;
      return acc;
    }, {})
  );
  return uniqueData;
};
const getRecommend = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const SearchByUser = await Search.find({ idUser: id }, "content")
        .limit(5)
        .sort({ createdAt: -1, updatedAt: -1 });

      const products = await Product.find({}, "_id name");

      var dataSearch = JSON.stringify(products);

      fs.writeFileSync("data.json", dataSearch);

      const dataset = JSON.parse(fs.readFileSync("data.json", "utf-8"));

      // // Chuẩn bị dữ liệu đầu vào và đầu ra
      const idPost = []; // Tiêu đề bài viết dự đoán
      const inputTitles = []; // Tiêu đề bài viết
      dataset.forEach((value) => {
        idPost.push(value._id);
        const nameNomaly = value.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        inputTitles.push(nameNomaly.toLowerCase());
      });

      const tfidf = new TfIdf();

      inputTitles.forEach((value) => {
        tfidf.addDocument(value);
      });
      var s = JSON.stringify(tfidf);
      // console.log(inputTitles[0].split(" "), s);

      fs.writeFileSync("model.json", s);

      const model = fs.readFileSync("model.json", "utf-8");
      var tfidfmodel = new TfIdf(JSON.parse(model));

      const viewed_data = [];
      // let viewed_data = [
      //   ["com"],
      // ];
      SearchByUser.forEach((value) => {
        viewed_data.push(value.content);
      });

      const trainData = [];
      let data_ = [];
      viewed_data.forEach((value) => {
        tfidfmodel.tfidfs(value, function (i, measure) {
          if (measure > 0) {
            console.log(dataset[i].name);
            console.log(data_.indexOf(dataset[i].name));
            if (data_.indexOf(dataset[i].name) < 0) {
              let dataa = {
                ...dataset[i],
                similarities: measure,
              };

              trainData.push(dataa);
            }
          }
        });
      });

      const productByRecommend = await Promise.all(
        trainData.map(async (pro) => {
          const productByRecommend = await Product.find({ _id: pro._id });

          return {
            _id: pro._id,
            name: pro.name,
            products: productByRecommend,
          };
        })
      );

      const productByRecommend8NotDuplicate =
        removeDuplicateObjects(productByRecommend);
      const productByRecommend8 = productByRecommend8NotDuplicate.slice(0, 8);

      if (productByRecommend8 === null) {
        resolve({
          status: "ERR",
          message: "The Cart is not defined",
        });
      } else {
        resolve(await Promise.all(productByRecommend8));
        // resolve({
        //   status: "OK",
        //   message: "Success",
        //   data: uniqueData,
        // });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getRecommendNoId = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const products = await Order.aggregate([
        {
          $unwind: "$orderItems", // Deconstruct the orderItems array
        },
        {
          $match: {
            // _id: "657ad15ae10aec55c004bff7", // Convert the orderId to ObjectId if it's a string
            "orderItems.name": "banhmi", // Filter only 'banhmi' items
          },
        },
        {
          $group: {
            _id: "$orderItems._id",
            totalPrice: {
              $sum: { $multiply: ["$orderItems.price", "$orderItems.amount"] },
            },
            user: { $first: "$user" }, // Include the user field
            shippingAddress: { $first: "$shippingAddress" }, // Include the shippingAddress field
            paymentMethod: { $first: "$paymentMethod" },
            orderItems: { $first: "$orderItems" },
          },
        },
      ]);
      // const products = await Product.find({}, "_id name");
      // const hotSearch = await Search.aggregate([
      //   {
      //     $group: {
      //       _id: "$content",
      //       count: { $sum: 1 },
      //       id: { $first: "$_id" },
      //       content: { $first: "$content" },
      //     },
      //   },
      //   { $match: { count: { $gt: 1 } } },
      //   { $sort: { count: -1 } },
      // ]);
      // var dataSearch = JSON.stringify(products);

      // fs.writeFileSync("dataNoid.json", dataSearch);

      // const dataset = JSON.parse(fs.readFileSync("dataNoid.json", "utf-8"));

      // // // Chuẩn bị dữ liệu đầu vào và đầu ra
      // const idPost = []; // Tiêu đề bài viết dự đoán
      // const inputTitles = []; // Tiêu đề bài viết
      // dataset.forEach((value) => {
      //   idPost.push(value._id);
      //   const nameNomaly = value.name
      //     .normalize("NFD")
      //     .replace(/[\u0300-\u036f]/g, "");

      //   inputTitles.push(nameNomaly.toLowerCase());
      // });

      // const tfidf = new TfIdf();

      // inputTitles.forEach((value) => {
      //   tfidf.addDocument(value);
      // });
      // var s = JSON.stringify(tfidf);
      // console.log(inputTitles[0].split(" "), s);

      // fs.writeFileSync("modelNoId.json", s);

      // const model = fs.readFileSync("modelNoId.json", "utf-8");
      // var tfidfmodel = new TfIdf(JSON.parse(model));

      // const viewed_data = [];
      // // let viewed_data = [
      // //   ["com"],
      // // ];
      // hotSearch.forEach((value) => {
      //   viewed_data.push(value.content);
      // });

      // const trainData = [];
      // let data_ = [];
      // viewed_data.forEach((value) => {
      //   tfidfmodel.tfidfs(value, function (i, measure) {
      //     if (measure > 0) {
      //       console.log(dataset[i].name);
      //       console.log(data_.indexOf(dataset[i].name));
      //       if (data_.indexOf(dataset[i].name) < 0) {
      //         let dataa = {
      //           ...dataset[i],
      //           similarities: measure,
      //         };

      //         trainData.push(dataa);
      //       }
      //     }
      //   });
      // });

      // const productByRecommend = await Promise.all(
      //   trainData.map(async (pro) => {
      //     const productByRecommend = await Product.find({ _id: pro._id });

      //     return {
      //       _id: pro._id,
      //       name: pro.name,
      //       products: productByRecommend,
      //     };
      //   })
      // );
      // const productByRecommend8NotDuplicate =
      //   removeDuplicateObjects(productByRecommend);
      // const productByRecommend8 = productByRecommend8NotDuplicate.slice(0, 8);

      // if (productByRecommend8 === null) {
      //   resolve({
      //     status: "ERR",
      //     message: "The Cart is not defined",
      //   });
      // } else {
      //   resolve(await Promise.all(productByRecommend8));
      // }

      resolve({
        status: "OK",
        message: "Success",
        data: products,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getByStore = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const TotalallObject = await Product.find({ idStore: id });

      resolve({
        status: "OK",
        message: "Success",
        data: TotalallObject,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProductS,
  deleteManyProduct,
  getAllType,
  getRecommend,
  getRecommendNoId,
  getByStore,
};
