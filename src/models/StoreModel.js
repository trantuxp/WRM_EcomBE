const mongoose = require("mongoose");
const storeSchema = new mongoose.Schema(
  {
    nameStore: { type: String },
    addressStore: { type: String, required: true },
    avatarStore: { type: String },
  },
  {
    timestamps: true,
  }
);
const Store = mongoose.model("store", storeSchema);
module.exports = Store;
