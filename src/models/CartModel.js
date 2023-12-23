const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    idItem: { type: mongoose.Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
