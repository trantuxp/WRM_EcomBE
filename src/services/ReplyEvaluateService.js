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

const getByEvaluate = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allReplyEvaluate = await ReplyEvaluate.aggregate([
        {
          $lookup: {
            from: "evaluates",
            localField: "idEvaluate",
            foreignField: "_id",
            as: "evaluate",
          },
        },
      ]);
      const ReplyEvaluates = allReplyEvaluate.map(async (eva) => {
        const UserByIdUser = await User.find({ _id: eva.evaluate[0].idUser });
        if (eva?.idEvaluate.toString() !== id) {
          console.log("first", id, eva.idEvaluate);
        } else {
          return {
            _id: eva._id,
            idEvaluate: eva.idEvaluate,
            idStore: eva.idStore,
            content: eva.content,
            evaluate: eva.evaluate,
            user: UserByIdUser,
          };
        }
      });
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
