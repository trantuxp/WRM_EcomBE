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
    const { amount } = req.body;
    if (!cartId) {
      return res.status(200).json({
        status: "ERR",
        message: "The cartId is required",
      });
    }
    console.log("cartId, amount", cartId, amount);
    const response = await CartService.updateCart(cartId, amount);
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
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    if (!cartId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await CartService.deleteCart(cartId);
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
};
