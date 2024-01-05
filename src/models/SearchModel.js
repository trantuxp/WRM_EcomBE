const mongoose = require("mongoose");
const searchSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    idUser: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Search = mongoose.model("Search", searchSchema);
module.exports = Search;
