const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post("/create", PostController.createPost);
router.put("/update/:id", authMiddleWare, PostController.updatePost);
router.get("/get-details/:id", PostController.getDetailsPost);
router.delete("/delete/:id", authMiddleWare, PostController.deletePost);
router.get("/get-all", PostController.getAllPost);
router.post("/delete-many", authMiddleWare, PostController.deleteMany);
router.get("/get-all-by-store/:id", PostController.getAllPostByStore);

module.exports = router;
