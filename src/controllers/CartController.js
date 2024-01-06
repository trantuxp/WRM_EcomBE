const CartService = require("../services/CartService");

const createCart = async (req, res) => {
  try {
    const { idItem, amount, totalPrice, idUser } = req.body;
    if (!idItem || !amount || !totalPrice || !idUser) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    console.log("req.body", req.body);
    const response = await CartService.createCart(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    const { amount, iduser } = req.query;
    if (!cartId) {
      return res.status(200).json({
        status: "ERR",
        message: "The cartId is required",
      });
    }
    // console.log("cartId, amount", cartId, amount);
    const response = await CartService.updateCart(cartId, amount, iduser);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await CartService.getAllByUser(userId);
    return res.status(200).send(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    const { iduser } = req.query;

    if (!cartId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await CartService.deleteCart(cartId, iduser);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteManyCart = async (req, res) => {
  try {
    const { ids, idUser } = req.query;
    if (!ids && !idUser) {
      return res.status(200).json({
        status: "ERR",
        message: "The ids is required",
      });
    }
    const response = await CartService.deleteManyCart(ids, idUser);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createCart,
  updateCart,
  getAllByUser,
  deleteCart,
  deleteManyCart,
};
