const Product = require("../models/ProductModel");
const Search = require("../models/SearchModel");
const Store = require("../models/StoreModel");
const fs = require("fs");
const TfIdf = require("node-tfidf");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const unorm = require("unorm");
const Cart = require("../models/CartModel");
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
      const product = await Product.find({
        _id: id,
      });
      // console.log(product.idStore);
      const productDetailAndStore = product.map(async (pro) => {
        const productDetailAndStore = await Store.find(
          {
            idUser: pro.idStore,
          },
          "nameStore"
        );

        return {
          _id: pro._id,
          name: pro.name,
          image: pro.image,
          type: pro.type,
          price: pro.price,
          countInStock: pro.countInStock,
          rating: pro.rating,
          description: pro.description,
          discount: pro.discount,
          selled: pro.selled,
          idStore: pro.idStore,
          createdAt: pro.createdAt,
          updatedAt: pro.updatedAt,
          store: productDetailAndStore,
        };
      });
      // resolve({
      //   status: "OK",
      //   message: "Delete ReplyEvaluate success",
      //   data: allReplyEvaluateById,
      // });
      resolve(await Promise.all(productDetailAndStore));

      // if (product === null) {
      //   resolve({
      //     status: "ERR",
      //     message: "The product is not defined",
      //   });
      // }

      resolve({
        status: "OK",
        message: "SUCESS",
        data: productDetailAndStore,
      });
    } catch (e) {
      reject(e);
    }
  });
};
function searchStartsWith(query, dataArray) {
  const result = [];
  const queryNomaly = query.normalize("NFD").replace(/[\u0300-\u036f]/, "");
  const queryNomalylower = queryNomaly.toLowerCase();
  dataArray.map((value) => {
    // Chuẩn hóa văn bản có dấu thành không dấu
    const value1 = value.name.normalize("NFD").replace(/[\u0300-\u036f]/, "");
    const value2 = value1.toLowerCase();
    if (value2.includes(queryNomalylower)) {
      result.push(value);
    }
  });

  return result;
}

// Sử dụng hàm tìm kiếm

const getAllProductS = (limit, page, sort, filter, type1) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();

      let allProduct = [];

      if (filter) {
        if (type1) {
          if (sort) {
            const TotalallObject = await Product.find({
              type: type1,
            });
            const TotalallObjectFilter = searchStartsWith(
              filter,
              TotalallObject
            );
            const limit1 = limit;
            // Số trang cần bỏ qua
            const page1 = page + 1;

            // Tính vị trí bắt đầu (index) dựa trên page và limit
            const startIndex = (page1 - 1) * limit1;
            // console.log(TotalallObjectFilter);
            const totalProductFilter = TotalallObjectFilter.length;

            const allObjectFilterIn = TotalallObjectFilter.slice(
              (page1 - 1) * limit1,
              startIndex + limit1
            ) // Limit and skip
              .sort((a, b) => a.price - b.price);
            const allObjectFilterDe = TotalallObjectFilter.slice(
              (page1 - 1) * limit1,
              startIndex + limit1
            ) // Limit and skip
              .sort((a, b) => b.price - a.price);
            if (sort == 1) {
              if (typeof page !== "undefined" && typeof limit !== "undefined") {
                resolve({
                  status: "OK",
                  message: "Success",
                  data: allObjectFilterIn,
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
            } else {
              if (typeof page !== "undefined" && typeof limit !== "undefined") {
                resolve({
                  status: "OK",
                  message: "Success",
                  data: allObjectFilterDe,
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
          } else {
            const TotalallObject = await Product.find({
              type: type1,
            });
            const TotalallObjectFilter = searchStartsWith(
              filter,
              TotalallObject
            );
            const limit1 = limit;
            // Số trang cần bỏ qua
            const page1 = page + 1;

            // Tính vị trí bắt đầu (index) dựa trên page và limit
            const startIndex = (page1 - 1) * limit1;
            // console.log(TotalallObjectFilter);
            const allObjectFilter = TotalallObjectFilter.slice(
              (page1 - 1) * limit1,
              startIndex + limit1
            ) // Limit and skip
              .sort(
                (a, b) => b.createdAt - a.createdAt || b.updatedAt - a.updatedAt
              ); // Sort by createdAt and updatedAt

            const totalProductFilter = TotalallObjectFilter.length;
            if (typeof page !== "undefined" && typeof limit !== "undefined") {
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
        } else {
          if (sort) {
            const TotalallObject = await Product.find();
            const TotalallObjectFilter = searchStartsWith(
              filter,
              TotalallObject
            );
            const limit1 = limit;
            // Số trang cần bỏ qua
            const page1 = page + 1;

            // Tính vị trí bắt đầu (index) dựa trên page và limit
            const startIndex = (page1 - 1) * limit1;
            // console.log(TotalallObjectFilter);
            const totalProductFilter = TotalallObjectFilter.length;

            const allObjectFilterIn = TotalallObjectFilter.slice(
              (page1 - 1) * limit1,
              startIndex + limit1
            ) // Limit and skip
              .sort((a, b) => a.price - b.price);
            const allObjectFilterDe = TotalallObjectFilter.slice(
              (page1 - 1) * limit1,
              startIndex + limit1
            ) // Limit and skip
              .sort((a, b) => b.price - a.price);
            if (sort == 1) {
              if (typeof page !== "undefined" && typeof limit !== "undefined") {
                resolve({
                  status: "OK",
                  message: "Success",
                  data: allObjectFilterIn,
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
            } else {
              if (typeof page !== "undefined" && typeof limit !== "undefined") {
                resolve({
                  status: "OK",
                  message: "Success",
                  data: allObjectFilterDe,
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
          } else {
            const TotalallObject = await Product.find();
            const TotalallObjectFilter = searchStartsWith(
              filter,
              TotalallObject
            );
            const limit1 = limit;
            // Số trang cần bỏ qua
            const page1 = page + 1;

            // Tính vị trí bắt đầu (index) dựa trên page và limit
            const startIndex = (page1 - 1) * limit1;
            // console.log(TotalallObjectFilter);
            const allObjectFilter = TotalallObjectFilter.slice(
              (page1 - 1) * limit1,
              startIndex + limit1
            ) // Limit and skip
              .sort(
                (a, b) => b.createdAt - a.createdAt || b.updatedAt - a.updatedAt
              ); // Sort by createdAt and updatedAt

            const totalProductFilter = TotalallObjectFilter.length;
            if (typeof page !== "undefined" && typeof limit !== "undefined") {
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
        }
      }
      if (type1) {
        if (sort) {
          const sortI = Number(sort);
          const TotalallObject = await Product.find({
            type: type1,
          });

          const allObjectFilter = await Product.find({
            type: type1,
          })
            .limit(limit)
            .skip(page * limit)
            .sort({ price: sortI })
            .exec();

          const totalProductFilter = TotalallObject.length;
          if (typeof page !== "undefined" && typeof limit !== "undefined") {
            resolve({
              status: "OK",
              message: "Success",
              data: allObjectFilter,
              total: totalProductFilter,
              pageCurrent: Number(page + 1),
              totalPage: Math.ceil(totalProductFilter / limit),
            });
          }
          // resolve({
          //   status: "OK",
          //   message: "Success",
          //   data: TotalallObject,
          //   total: totalProductFilter,
          // });
        } else {
          const TotalallObject = await Product.find({
            type: type1,
          });

          const allObjectFilter = await Product.find({
            type: type1,
          })
            .limit(limit)
            .skip(page * limit)
            .exec();

          const totalProductFilter = TotalallObject.length;
          if (typeof page !== "undefined" && typeof limit !== "undefined") {
            resolve({
              status: "OK",
              message: "Success",
              data: allObjectFilter,
              total: totalProductFilter,
              pageCurrent: Number(page + 1),
              totalPage: Math.ceil(totalProductFilter / limit),
            });
          } else
            resolve({
              status: "OK",
              message: "Success",
              data: TotalallObject,
              total: totalProductFilter,
            });
        }
      }
      if (sort) {
        const sortI = Number(sort);
        const allProductSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort({ price: sortI })
          .exec();

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
const getAllProductSv2 = async () => {
  console.log("ab");

  try {
    const allProduct = await Product.find({}, "_id name type");
    console.log(allProduct);

    const dataWithPaymentMethod = allProduct.map((item) => {
      return item;
    });

    const csvWriter = await createCsvWriter({
      path: "C:/Users/Tu/Downloads/orders09.csv",
      header: [
        { id: "_id", title: "Product_ID" },
        { id: "name", title: "name" },
        { id: "type", title: "type" },
      ],
    });

    csvWriter
      .writeRecords(dataWithPaymentMethod)
      .then(() => console.log("CSV file created successfully."))
      .catch((error) => console.error(error));
  } catch (e) {
    console.log(e);
    // reject(e);
  }
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
      // const SearchByUser = await Search.find({ idUser: id }, "content")
      //   .limit(5)
      //   .sort({ createdAt: -1, updatedAt: -1 });

      const SearchByPro = await Product.find({ _id: id }, "name");
      // console.log(SearchByPro[0].name);
      const arr = [];
      const name = SearchByPro[0].name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      arr.push(name.toLowerCase());

      const products = await Product.find(
        {
          _id: { $ne: id },
        },
        "_id name"
      );

      // const products = await Product.find(
      //   { },
      //   "_id name"
      // );

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
      arr.forEach((value) => {
        viewed_data.push(value);
      });
      // console.log(arr);

      const trainData = [];
      let data_ = [];
      viewed_data.forEach((value) => {
        tfidfmodel.tfidfs(value, function (i, measure) {
          if (measure > 0) {
            // console.log(dataset[i].name);
            // console.log(data_.indexOf(dataset[i].name));
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
      // console.log(trainData);

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
      const products = await Product.find({}, "_id name");
      const hotSearch = await Search.aggregate([
        {
          $group: {
            _id: "$content",
            count: { $sum: 1 },
            id: { $first: "$_id" },
            content: { $first: "$content" },
          },
        },
        { $match: { count: { $gt: 1 } } },
        { $sort: { count: -1 } },
      ]);
      var dataSearch = JSON.stringify(products);

      fs.writeFileSync("dataNoid.json", dataSearch);

      const dataset = JSON.parse(fs.readFileSync("dataNoid.json", "utf-8"));

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
        tfidf.addDocument(value.split(" "));
      });
      var s = JSON.stringify(tfidf);
      // console.log(inputTitles[0].split(" "), s);

      fs.writeFileSync("modelNoId.json", s);

      const model = fs.readFileSync("modelNoId.json", "utf-8");
      var tfidfmodel = new TfIdf(JSON.parse(model));
      const viewed_data = ["ca phe"];

      // hotSearch.forEach((value) => {
      //   viewed_data.push(value.content);
      // });
      // console.log("view_data", viewed_data);
      const trainData = [];
      let data_ = [];
      viewed_data.forEach((value) => {
        tfidfmodel.tfidfs(value.split(" "), function (i, measure) {
          if (measure > 0) {
            // console.log(dataset[i].name);
            // console.log(data_.indexOf(dataset[i].name));
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
      }

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
  getAllProductSv2,
};
