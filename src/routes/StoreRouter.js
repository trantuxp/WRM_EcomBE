const express = require("express");
const router = express.Router();
const StoreController = require("../controllers/StoreController");

router.post("/create/:id", StoreController.createStore);

// router.get('/get-all-type', ProductController.getAllType)

module.exports = router;
