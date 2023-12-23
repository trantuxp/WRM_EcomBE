const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post("/create", PostController.createPost);
router.put("/update/:id", PostController.updatePost);
router.get("/get-details/:id", PostController.getDetailsPost);
router.delete("/delete/:id", PostController.deletePost);
router.get("/get-all", PostController.getAllPost);
router.post("/delete-many", PostController.deleteMany);
router.get("/get-all-by-store/:id", PostController.getAllPostByStore);

module.exports = router;
