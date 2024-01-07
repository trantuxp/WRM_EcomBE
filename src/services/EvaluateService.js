const Evaluate = require("../models/EvaluateModel");
const Product = require("../models/ProductModel");

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
      const evaluate = await Evaluate.aggregate([
        // {
        //   $lookup: {
        //     from: "products",
        //     localField: "idItem",
        //     foreignField: "_id",
        //     as: "product",
        //   },
        // },
        {
          $lookup: {
            from: "products",
            localField: "idItem",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $lookup: {
            from: "users",
            localField: "idUser",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
      ]);

      const EvaluateByStore = evaluate.map(async (eva) => {
        if (eva.product?.idStore && eva.product?.idStore !== id) {
        } else {
          if (eva.star > 0)
            return {
              _id: eva._id,
              idItem: eva.idItem,
              idUser: eva.idUser,
              idOrder: eva.idOrder,
              content: eva.content,
              star: eva.star,
              product: eva.product,
              productName: eva.product.name,
              user: eva.user,
              userName: eva.user.name,
              createdAt: eva.createdAt,
              updatedAt: eva.updatedAt,
            };
        }
      });

      if (EvaluateByStore === null) {
        resolve({
          status: "ERR",
          message: "The Cart is not defined",
        });
      } else {
        resolve(await Promise.all(EvaluateByStore));
      }
      // const allEvaluate = await Evaluate.find().sort({
      //   createdAt: -1,
      //   updatedAt: -1,
      // });
      // resolve({
      //   status: "OK",
      //   message: "Success",
      //   data: evaluate,
      // });
    } catch (e) {
      reject("loi");
    }
  });
};
const getByItemOrder = (idItem, idOrder) => {
  return new Promise(async (resolve, reject) => {
    try {
      const evaluate = await Evaluate.find({
        idOrder: idOrder,
        idItem: idItem,
      });

      if (evaluate === null) {
        resolve({
          status: "ERR",
          message: "The Cart is not defined",
        });
      } else {
        resolve({
          status: "OK",
          message: "Success",
          data: evaluate,
        });
      }
      // const allEvaluate = await Evaluate.find().sort({
      //   createdAt: -1,
      //   updatedAt: -1,
      // });
      //
    } catch (e) {
      reject("loi");
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
  getByItemOrder,
};
