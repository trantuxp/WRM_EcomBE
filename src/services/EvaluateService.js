const Evaluate = require("../models/EvaluateModel");

const createEvaluate = (newEvaluate) => {
  return new Promise(async (resolve, reject) => {
    const { idItem, idUser, idOrder, content, star } = newEvaluate;

    try {
      const checkEvaluate = await Evaluate.findOne({
        idItem: idItem,
        idUser: idUser,
        idOrder: idOrder,
      });
      if (checkEvaluate !== null) {
        resolve({
          status: "ERR",
          message: "The name of Evaluate is already",
        });
        return;
      }
      const newEvaluateQuery = await Evaluate.create({
        idItem,
        idUser,
        idOrder,
        content,
        star: Number(star),
      });
      if (newEvaluateQuery) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newEvaluateQuery,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const updateEvaluate = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkEvaluate = await Evaluate.findOne({
        _id: id,
      });
      if (checkEvaluate === null) {
        resolve({
          status: "ERR",
          message: "The Evaluate is not defined",
        });
      }

      const updatedEvaluate = await Evaluate.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedEvaluate,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllByStore = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allEvaluate = await Evaluate.find().sort({
        createdAt: -1,
        updatedAt: -1,
      });
      resolve({
        status: "OK",
        message: "Success",
        data: allEvaluate,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteEvaluate = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkEvaluate = await Evaluate.findOne({
        _id: id,
      });
      if (checkEvaluate === null) {
        resolve({
          status: "ERR",
          message: "The Evaluate is not defined",
        });
      }

      await Evaluate.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete Evaluate success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createEvaluate,
  updateEvaluate,
  getAllByStore,
  deleteEvaluate,
};
