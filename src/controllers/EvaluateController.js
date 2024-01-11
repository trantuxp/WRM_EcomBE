const EvaluateService = require("../services/EvaluateService");

const createEvaluate = async (req, res) => {
  try {
    const { idItem, idUser, idOrder, content, star } = req.body;

    if (!idItem || !idUser || !idOrder || !content || !star) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await EvaluateService.createEvaluate(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateEvaluate = async (req, res) => {
  try {
    const EvaluateId = req.params.id;
    const data = req.body;
    if (!EvaluateId) {
      return res.status(200).json({
        status: "ERR",
        message: "The EvaluateId is required",
      });
    }
    console.log("EvaluateId, amount", EvaluateId, data);
    const response = await EvaluateService.updateEvaluate(EvaluateId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllByStore = async (req, res) => {
  try {
    const idStore = req.params.id;
    if (!idStore) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await EvaluateService.getAllByStore(idStore);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getByItem = async (req, res) => {
  try {
    const { idItem } = req.query;
    console.log("idItem", idItem);
    if (!idItem) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await EvaluateService.getByItem(idItem);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getByItemOrder = async (req, res) => {
  try {
    const { idItem, idOrder } = req.query;
    if (!idItem || !idOrder) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await EvaluateService.getByItemOrder(idItem, idOrder);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteEvaluate = async (req, res) => {
  try {
    const EvaluateId = req.params.id;
    if (!EvaluateId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await EvaluateService.deleteEvaluate(EvaluateId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getTotalEvaByUser = async (req, res) => {
  try {
    const response = await EvaluateService.getTotalEvaByUser();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createEvaluate,
  updateEvaluate,
  getAllByStore,
  deleteEvaluate,
  getByItemOrder,
  getTotalEvaByUser,
  getByItem,
};
