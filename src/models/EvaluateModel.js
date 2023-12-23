const mongoose = require("mongoose");

const evaluateSchema = new mongoose.Schema(
  {
    idItem: { type: mongoose.Schema.Types.ObjectId, required: true },
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    idOrder: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    star: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const Evaluate = mongoose.model("Evaluate", evaluateSchema);
module.exports = Evaluate;
