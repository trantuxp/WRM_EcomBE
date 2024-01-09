const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { authMiddleWareStore } = require("../middleware/authMiddleware");

router.post("/create", ProductController.createProduct);
router.put("/update/:id", authMiddleWareStore, ProductController.updateProduct);
router.get("/get-details/:id", ProductController.getDetailsProduct);
router.delete(
  "/delete/:id",
  authMiddleWareStore,
  ProductController.deleteProduct
);
router.get("/get-all", ProductController.getAllProduct);
router.get("/get-by-store/:id", ProductController.getByStore);
router.post("/delete-many", authMiddleWareStore, ProductController.deleteMany);
router.get("/get-all-type", ProductController.getAllType);
router.get("/get-recommend/:id", ProductController.getRecommend);
router.get("/get-recommend-no-id", ProductController.getRecommendNoId);

module.exports = router;
