const mongoose = require("mongoose");

const replyEvaluateSchema = new mongoose.Schema(
  {
    idEvaluate: { type: mongoose.Schema.Types.ObjectId, required: true },
    idStore: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const ReplyEvaluate = mongoose.model("ReplyEvaluate", replyEvaluateSchema);
module.exports = ReplyEvaluate;
