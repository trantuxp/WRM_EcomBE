const StoreService = require("../services/StoreService");
const JwtService = require("../services/JwtService");
const _ = require("lodash");

const createStore = async (req, res) => {
  if (!_.isEmpty(req.body)) {
    try {
      const { nameStore, addressStore, avatarStore } = req.body;
      const id = req.params.id;

      if (!nameStore || !addressStore) {
        return res.status(200).json({
          status: "ERR",
          message: "The input is required",

          // email: email,
          // password: password,
          // confirmPassword: confirmPassword,
        });
      }
      //console.log("day", id);
      const response = await StoreService.createStore(id, req.body);
      return res.status(200).json(response);
    } catch (e) {
      return res.status(404).json({
        message: e,
      });
    }
  } else {
    res.send("ERR");
  }
};
const getDetailsStore = async (req, res) => {
  try {
    const id = req.params.id.toString();
    if (!id) {
      return res.status(200).json({
        status: "ERR",
        message: "The storeId is required",
      });
    }
    const response = await StoreService.getDetailsStoreSv(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: "asd",
    });
  }
};

module.exports = {
  createStore,
  getDetailsStore,
};
