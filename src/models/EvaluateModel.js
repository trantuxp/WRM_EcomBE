const mongoose = require("mongoose");

const evaluateSchema = new mongoose.Schema(
  {
    idItem: { type: String, required: true },
    idUser: { type: String, required: true },
    idOrder: { type: String, required: true },
    content: { type: String, required: true },
    star: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const Evaluate = mongoose.model("Evaluate", evaluateSchema);
module.exports = Evaluate;
