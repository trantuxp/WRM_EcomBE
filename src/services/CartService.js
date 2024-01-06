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
const updateCart = (id, newAmount, iduser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCart = await Cart.findOne({
        idItem: id,
        idUser: iduser,
      });

      if (checkCart === null) {
        resolve({
          status: "ERR",
          message: "The cart is not defined",
        });
      }

      if (newAmount) {
        const updatedCart = await Cart.findByIdAndUpdate(
          checkCart._id,
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

      const cartByUsers = cartByUser.map(async (pro) => {
        const proByUser = await Product.find({ _id: pro.idItem });
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

      if (cartByUsers === null) {
        resolve({
          status: "ERR",
          message: "The Cart is not defined",
        });
      } else {
        resolve(await Promise.all(cartByUsers));
        // resolve({
        //   status: "OK",
        //   message: "Success",
        //   data: cartByUsers,
        // });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCart = (id, iduser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCart = await Cart.findOne({
        idItem: id,
        idUser: iduser,
      });
      if (checkCart === null) {
        resolve({
          status: "ERR",
          message: "The Cart is not defined",
        });
      }

      await Cart.findByIdAndDelete(checkCart._id);
      resolve({
        status: "OK",
        message: "Delete Cart success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteManyCart = (ids, idUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("ids", ids, idUser);
      const arrayId = ids.split(",");
      console.log(typeof arrayId, arrayId);

      arrayId.map((id) => {
        console.log("id", id);
        deleteCart(id, idUser);
      });
      // resolve(await Promise.all(cartById));

      // const deleteMany = await Cart.deleteMany(filter);
      // console.log("findMany", cartById);
      // resolve({
      //   status: "OK",
      //   message: "Delete product success",
      //   data: cartById,
      // });
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
  deleteManyCart,
};
