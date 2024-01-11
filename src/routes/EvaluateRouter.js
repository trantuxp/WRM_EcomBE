const express = require("express");
const router = express.Router();
const EvaluateController = require("../controllers/EvaluateController");

router.post("/create/", EvaluateController.createEvaluate);
router.put("/update/:id", EvaluateController.updateEvaluate);
router.get("/get-all-by-store/:id", EvaluateController.getAllByStore);
router.get("/get-by-item-order", EvaluateController.getByItemOrder);
router.get("/get-by-item", EvaluateController.getByItem);
router.delete("/delete/:id", EvaluateController.deleteEvaluate);
// router.get("/get-count-evaluate", EvaluateController.getTotalEvaByUser);

module.exports = router;
