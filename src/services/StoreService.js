const Store = require("../models/StoreModel");
const User = require("../models/UserModel");

const createStore = (id, newStore) => {
  return new Promise(async (resolve, reject) => {
    const { nameStore, addressStore, avatarStore } = newStore;
    const idUser = id;
    try {
      const checkStore = await Store.findOne({
        nameStore: nameStore,
      });

      if (checkStore !== null) {
        resolve({
          status: "ERR",
          message: "The Store name is already",
        });
        return;
      }

      const createdStore = await Store.create({
        nameStore,
        addressStore,
        avatarStore,
        idUser,
      });

      if (createdStore) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdStore,
        });
        try {
          const checkUser = await User.findOne({
            _id: id,
          });
          if (checkUser === null) {
            resolve({
              status: "ERR",
              message: "The user is not defined",
            });
          }

          const updatedUser = await User.findByIdAndUpdate(
            id,
            { isStore: true },
            {
              new: true,
            }
          );
          resolve({
            status: "OK",
            message: "SUCCESSUpdate",
            data: updatedUser,
          });
          //console.log("vao day r day", updatedUser, id);
        } catch (e) {
          reject(e);
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailsStoreSv = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const store = await Store.findOne({
        _id: id,
      });
      console.log("store", store);

      if (store === null) {
        resolve({
          status: "ERR",
          message: "The store is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESS",
        data: store,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createStore,
  getDetailsStoreSv,
};
