const express = require("express");
const router = express.Router();
const CartController = require("../controllers/CartController");

router.post("/create/", CartController.createCart);
router.put("/update/:id", CartController.updateCart);
router.get("/get-all-by-user/:id", CartController.getAllByUser);
router.delete("/delete/:id", CartController.deleteCart);

module.exports = router;
