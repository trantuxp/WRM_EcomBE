const ReplyEvaluate = require("../models/ReplyEvaluateModel");

const createReplyEvaluate = (newReplyEvaluate) => {
  return new Promise(async (resolve, reject) => {
    const { idEvaluate, idStore, content } = newReplyEvaluate;

    try {
      const checkReplyEvaluate = await ReplyEvaluate.findOne({
        idEvaluate: idEvaluate,
      });
      if (checkReplyEvaluate !== null) {
        resolve({
          status: "ERR",
          message: "The name of ReplyEvaluate is already",
        });
        return;
      }
      const newReplyEvaluateQuery = await ReplyEvaluate.create({
        idEvaluate,
        idStore,
        content,
      });
      if (newReplyEvaluateQuery) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newReplyEvaluateQuery,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const updateReplyEvaluate = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkReplyEvaluate = await ReplyEvaluate.findOne({
        _id: id,
      });
      if (checkReplyEvaluate === null) {
        resolve({
          status: "ERR",
          message: "The ReplyEvaluate is not defined",
        });
      }

      const updatedReplyEvaluate = await ReplyEvaluate.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
        }
      );
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedReplyEvaluate,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getByEvaluate = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allReplyEvaluate = await ReplyEvaluate.find({
        idEvaluate: id,
      });
      resolve({
        status: "OK",
        message: "Success",
        data: allReplyEvaluate,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteReplyEvaluate = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkReplyEvaluate = await ReplyEvaluate.findOne({
        _id: id,
      });
      if (checkReplyEvaluate === null) {
        resolve({
          status: "ERR",
          message: "The ReplyEvaluate is not defined",
        });
      }

      await ReplyEvaluate.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete ReplyEvaluate success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createReplyEvaluate,
  updateReplyEvaluate,
  getByEvaluate,
  deleteReplyEvaluate,
};
