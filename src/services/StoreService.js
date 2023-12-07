const Store = require("../models/StoreModel");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

const createStore = (id, newStore) => {
  return new Promise(async (resolve, reject) => {
    const { nameStore, addressStore, avatarStore } = newStore;
    try {
      const checkStore = await Store.findOne({
        nameStore: nameStore,
      });

      if (checkStore !== null) {
        resolve({
          status: "ERR",
          message: "The email is already",
        });
        return;
      }

      const createdStore = await Store.create({
        nameStore,
        addressStore,
        avatarStore,
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

module.exports = {
  createStore,
};
