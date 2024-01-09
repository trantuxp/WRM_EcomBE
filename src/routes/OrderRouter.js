const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const { authMiddleWareStore } = require("../middleware/authMiddleware");

router.post("/create/:id", OrderController.createOrder);
router.get("/get-order-by-user/:id", OrderController.getAllOrderDetails);
router.get("/get-order-by-store/:id", OrderController.getOrderByStore);
router.get("/get-details-order/:id", OrderController.getDetailsOrder);
router.delete("/cancel-order/:id", OrderController.cancelOrderDetails);
router.get("/get-all-order", OrderController.getAllOrder);
router.put("/update/:id", OrderController.updateStateOrder);
router.put("/update-delivery/:id", OrderController.updateStateDeliveryOrder);

module.exports = router;
