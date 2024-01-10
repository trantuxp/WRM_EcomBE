const { identity } = require("lodash");
const Evaluate = require("../models/EvaluateModel");
const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
// const EmailService = require("../services/EmailService");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
      isPaid,
      paidAt,
      email,
    } = newOrder;
    try {
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: -order.amount,
              selled: +order.amount,
            },
          },
          { new: true }
        );
        if (productData) {
          return {
            status: "OK",
            message: "SUCCESS",
          };
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });

      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => item.id);
      if (newData.length > 0) {
        // console.log("dang  tạo ne", newData);

        const arrId = [];
        newData.forEach((item) => {
          arrId.push(item.id);
        });
        resolve({
          status: "ERR",
          message: `San pham voi id: ${arrId.join(",")} khong du hang`,
        });
      } else {
        const createdOrder = await Order.create({
          orderItems,
          shippingAddress: {
            fullName,
            address,
            city,
            phone,
          },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user: user,
          //   isPaid ,
          //   paidAt,
        });
        if (createdOrder) {
          //   await EmailService.sendEmailCreateOrder(email, orderItems);
          resolve({
            status: "OK",
            message: "success",
          });
        }
      }
    } catch (e) {
      //   console.log('e', e)
      reject(e);
    }
  });
};

// const deleteManyProduct = (ids) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             await Product.deleteMany({ _id: ids })
//             resolve({
//                 status: 'OK',
//                 message: 'Delete product success',
//             })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      }).sort({ createdAt: -1, updatedAt: -1 });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESSS",
        data: order,
      });
    } catch (e) {
      // console.log('e', e)
      reject(e);
    }
  });
};

const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findOne({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }
      // const evaluateByUsers = (
      //   order.map(async (ord) => {
      //     ord.orderItems.map(async (orderI) => {
      //       // const evaluateByUsers = await Evaluate.find({
      //       //   idItem: orderI.product,
      //       // });
      //       return {
      //         shippingAddress: ord.shippingAddress,
      //         _id: ord._id,
      //         orderItems: ord.ordItems,
      //         paymentMethod: ord.paymentMethod,
      //         itemsPrice: ord.itemsPrice,
      //         shippingPrice: ord.shippingPrice,
      //         totalPrice: ord.totalPrice,
      //         user: ord.user,
      //         isPaid: ord.isPaid,
      //         isDelivered: ord.isDelivered,
      //         // evaluateByUsers: evaluateByUsers,
      //         createdAt: ord.createdAt,
      //         updatedAt: ord.updatedAt,
      //       };
      //     });
      //   })
      // );
      // resolve(await Promise.all(evaluateByUsers));
      resolve({
        status: "OK",
        message: "SUCESSS",
        data: order,
      });
    } catch (e) {
      // console.log('e', e)
      reject(e);
    }
  });
};

const cancelOrderDetails = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [];
      const promises = data.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            selled: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: +order.amount,
              selled: -order.amount,
            },
          },
          { new: true }
        );
        if (productData) {
          order = await Order.findByIdAndDelete(id);
          if (order === null) {
            resolve({
              status: "OK",
              message: "The order is deleted",
            });
          }
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results[0] && results[0].id;

      if (newData) {
        resolve({
          status: "ERR",
          message: `San pham voi id: ${newData} khong ton tai`,
        });
      }
      resolve({
        status: "OK",
        message: "success",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrder = async () => {
  try {
    const orders = await Order.find({}, "orderItems.name user name").lean();

    const orderData = orders.map((order) => ({
      id: order._id,
      user: order.user,
      name: order.orderItems[0].name,
    }));

    const dataWithPaymentMethod = orderData.map((item) => {
      return item;
    });

    const csvWriter = await createCsvWriter({
      path: "C:/Users/Tu/Downloads/userOrder.csv",
      header: [
        { id: "user", title: "ID" },
        { id: "id", title: "ORDERID" },
        { id: "name", title: "interest" },
      ],
    });

    csvWriter
      .writeRecords(dataWithPaymentMethod)
      .then(() => console.log("CSV file created successfully."))
      .catch((error) => console.error(error));
  } catch (error) {
    // Handle error
    throw new Error("Failed to fetch order data");
  }
};
const getOrderByStore = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("id", typeof id);

      const orders = await Order.aggregate([
        {
          $unwind: "$orderItems", // Deconstruct the orderItems array
        },
        {
          $match: {
            // _id: "657ad15ae10aec55c004bff7", // Convert the orderId to ObjectId if it's a string
            "orderItems.idStore": id, // Filter only 'banhmi' items
          },
        },
        {
          $group: {
            _id: "$orderItems._id",
            totalPrice: {
              $sum: {
                $multiply: ["$orderItems.price", "$orderItems.amount"],
              },
            },
            user: { $first: "$user" }, // Include the user field
            shippingAddress: { $first: "$shippingAddress" }, // Include the shippingAddress field
            paymentMethod: { $first: "$paymentMethod" },
            orderItems: { $first: "$orderItems" },
            itemsPrice: { $first: "$itemsPrice" },
            shippingPrice: { $first: "$shippingPrice" },
            isPaid: { $first: "$isPaid" },
            isDelivered: { $first: "$isDelivered" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
          },
        },
      ]);
      resolve({
        status: "OK",
        message: "Success",
        data: orders,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updateStateOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("id", id);

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { isPaid: "true" },
        {
          new: true,
        }
      );
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updateStateDeliveryOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("id", id);

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { isDelivered: "true" },
        {
          new: true,
        }
      );
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
  getAllOrderDetails,
  getOrderDetails,
  cancelOrderDetails,
  getAllOrder,
  updateStateOrder,
  updateStateDeliveryOrder,
  getOrderByStore,
};
