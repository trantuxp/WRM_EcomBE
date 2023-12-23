const ReplyEvaluateService = require("../services/ReplyEvaluateService");

const createReplyEvaluate = async (req, res) => {
  try {
    const { idEvaluate, idStore, content } = req.body;
    if (!idEvaluate || !idStore || !content) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    console.log("req.body", req.body);
    const response = await ReplyEvaluateService.createReplyEvaluate(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateReplyEvaluate = async (req, res) => {
  try {
    const ReplyEvaluateId = req.params.id;
    const data = req.body;
    if (!ReplyEvaluateId) {
      return res.status(200).json({
        status: "ERR",
        message: "The ReplyEvaluateId is required",
      });
    }
    console.log("ReplyEvaluateId, amount", ReplyEvaluateId, data);
    const response = await ReplyEvaluateService.updateReplyEvaluate(
      ReplyEvaluateId,
      data
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getByEvaluate = async (req, res) => {
  try {
    const evaluateId = req.params.id;
    if (!evaluateId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ReplyEvaluateService.getByEvaluate(evaluateId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteReplyEvaluate = async (req, res) => {
  try {
    const ReplyEvaluateId = req.params.id;
    if (!ReplyEvaluateId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ReplyEvaluateService.deleteReplyEvaluate(
      ReplyEvaluateId
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createReplyEvaluate,
  updateReplyEvaluate,
  getByEvaluate,
  deleteReplyEvaluate,
};
