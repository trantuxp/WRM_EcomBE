const Evaluate = require("../models/EvaluateModel");
const ReplyEvaluate = require("../models/ReplyEvaluateModel");
const User = require("../models/UserModel");

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
const updateReplyEvaluate = (id, content) => {
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
        content,
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

const getByEvaluate = (id, idUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allReplyEvaluate = await ReplyEvaluate.find({
        idEvaluate: id,
      });
      // const allReplyEvaluateById = await Promise.all(
      //   allReplyEvaluate.find({
      //     idEvaluate: id,
      //   })
      // );

      const ReplyEvaluates = allReplyEvaluate.map(async (eva) => {
        const UserByIdUser = await User.find(
          {
            _id: idUser,
          },
          "_id name"
        );
        const evaluateById = await Evaluate.find({ _id: id });

        return {
          _id: eva._id,
          idEvaluate: eva.idEvaluate,
          idStore: eva.idStore,
          content: eva.content,
          evaluate: eva.evaluate,
          user: UserByIdUser,
          evaluate: evaluateById,
        };
      });
      // resolve({
      //   status: "OK",
      //   message: "Delete ReplyEvaluate success",
      //   data: allReplyEvaluateById,
      // });
      resolve(await Promise.all(ReplyEvaluates));
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
