const mongoose = require("mongoose");
const storeSchema = new mongoose.Schema(
  {
    nameStore: { type: String },
    addressStore: { type: String, required: true },
    avatarStore: { type: String },
    idUser: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Store = mongoose.model("store", storeSchema);
module.exports = Store;
