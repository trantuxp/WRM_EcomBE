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
      const cartByUser = await Cart.find({
        idUser: id,
      });

      let cartByUsers = cartByUser.map(async (pro) => {
        const proByUser = await Product.findOne({ _id: pro.idItem });
        return {
          _id: pro._id,
          idItem: pro.idItem,
          amount: pro.amount,
          totalPrice: pro.totalPrice,
          product: proByUser,
          idUser: pro.idUser,
          createdAt: pro.createdAt,
          updatedAt: pro.updatedAt,
        };
      });

      if (cartByUser === null) {
        resolve({
          status: "ERR",
          message: "The Cart is not defined",
        });
      } else {
        resolve(await Promise.all(cartByUsers));
      }
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
