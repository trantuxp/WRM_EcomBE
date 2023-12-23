const express = require("express");
const router = express.Router();
const EvaluateController = require("../controllers/EvaluateController");

router.post("/create/", EvaluateController.createEvaluate);
router.put("/update/:id", EvaluateController.updateEvaluate);
router.get("/get-all-by-store/:id", EvaluateController.getAllByStore);
router.delete("/delete/:id", EvaluateController.deleteEvaluate);

module.exports = router;
