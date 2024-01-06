const express = require("express");
const router = express.Router();
const ReplyEvaluateController = require("../controllers/ReplyEvaluateController");

router.post("/create", ReplyEvaluateController.createReplyEvaluate);
router.put("/update/:id", ReplyEvaluateController.updateReplyEvaluate);
router.get("/get-by-evaluate/:id", ReplyEvaluateController.getByEvaluate);
router.delete("/delete/:id", ReplyEvaluateController.deleteReplyEvaluate);

module.exports = router;
