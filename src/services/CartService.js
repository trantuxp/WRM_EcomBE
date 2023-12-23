const Cart = require("../models/CartModel");
// const EmailService = require("../services/EmailService");
const Product = require("../models/ProductModel");

const createCart = (newCart) => {
  return new Promise(async (resolve, reject) => {
    // //console.log("newCart", newCart);
    const { idItem, amount, totalPrice, idUser } = newCart;

    try {
      const checkCart = await Cart.findOne({
        idItem: idItem,
        idUser: idUser,
      });
      if (checkCart !== null) {
        resolve({
          status: "ERR",
          message: "The name of Cart is already",
        });
        return;
      }
      const newCartQuery = await Cart.create({
        idItem,
        amount: Number(amount),
        totalPrice,
        idUser,
      });
      if (newCartQuery) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newCartQuery,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const updateCart = (id, newAmount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCart = await Cart.findOne({
        _id: id,
      });
      if (checkCart === null) {
        resolve({
          status: "ERR",
          message: "The cart is not defined",
        });
      }

      if (newAmount) {
        const updatedCart = await Cart.findByIdAndUpdate(
          id,
          { amount: newAmount },
          {
            new: true,
          }
        );
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: updatedCart,
        });
      } else {
        const updatedCart = await Cart.findByIdAndUpdate(
          id,
          { $inc: { amount: 1 } },
          {
            new: true,
          }
        );
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: updatedCart,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllByUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const CartByUser = await Product.findOne(
      //   { idstore: id },
      //   function (err, product) {
      //     if (err) {
      //       console.log(
      //         "Error occurred while querying products collection",
      //         err
      //       );

      //       return;
      //     }

      //     if (product) {
      //       console.log(product);
      //       Cart.find({ idItem: product._id }).toArray(function (err, cart) {
      //         if (err) {
      //           console.log(
      //             "Error occurred while querying orders collection",
      //             err
      //           );

      //           return;
      //         }

      //         console.log(cart);
      //         return cart;
      //       });
      //     } else {
      //       console.log("No product found with the specified name");
      //     }
      //   }
      // );

      // const cart = await Cart.query({
      //   idUser: id,
      // });

      const cart = await Cart.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "idItem",
            foreignField: "_id",
            as: "orderdetails",
          },
        },
      ]);
      console.log("idUser", id);

      // const cartByStore = cart.data;
      // if (cartByStore === null) {
      //   resolve({
      //     status: "ERR",
      //     message: "The Cart is not defined",
      //   });
      // } else {
      //   resolve({
      //     status: "OK",
      //     message: "SUCESS",
      //     data: cartByStore,
      //   });
      // }

      if (cart === null) {
        resolve({
          status: "ERR",
          message: "The Cart is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESS",
        data: cart,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCart = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCart = await Cart.findOne({
        _id: id,
      });
      if (checkCart === null) {
        resolve({
          status: "ERR",
          message: "The Cart is not defined",
        });
      }

      await Cart.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete Cart success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createCart,
  updateCart,
  getAllByUser,
  deleteCart,
};
