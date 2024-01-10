const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    idItem: { type: String, required: true },
    amount: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    idUser: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
