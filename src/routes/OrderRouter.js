const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post("/create/:id", OrderController.createOrder);
router.get(
  "/get-all-order/:id",

  OrderController.getAllOrderDetails
);
router.get("/get-details-order/:id", OrderController.getDetailsOrder);
router.delete(
  "/cancel-order/:id",
  authMiddleWare,
  OrderController.cancelOrderDetails
);
router.get("/get-all-order", OrderController.getAllOrder);

module.exports = router;
