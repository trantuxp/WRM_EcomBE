const PostService = require("../services/PostService");

const createPost = async (req, res) => {
  try {
    const { title, content, image, idStore } = req.body;

    if (!title || !content || !image || !idStore) {
      console.log("post", title, content, image, idStore);
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await PostService.createPost(req.body);

    return res.status(200).json(response);
  } catch (e) {
    // //console.log("asdsad", req.body);

    return res.status(404).json({
      message: e,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const PostId = req.params.id;
    const data = req.body;
    if (!PostId) {
      return res.status(200).json({
        status: "ERR",
        message: "The PostId is required",
      });
    }
    const response = await PostService.updatePost(PostId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsPost = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(200).json({
        status: "ERR",
        message: "The PostId is required",
      });
    }

    const response = await PostService.getDetailsPostSv(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const PostId = req.params.id;
    if (!PostId) {
      return res.status(200).json({
        status: "ERR",
        message: "The PostId is required",
      });
    }
    const response = await PostService.deletePost(PostId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "The ids is required",
      });
    }
    const response = await PostService.deleteManyPost(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllPost = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response1 = await PostService.getAllPostS(
      Number(limit) || null,
      Number(page) || 0,
      sort || null,
      filter || null
    );
    // console.log("ádasd", req.query, Number(limit));

    return res.status(200).json(response1);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllPostByStore = async (req, res) => {
  try {
    const StoreId = req.params.id.toString();
    const response1 = await PostService.getAllPostByStoreSv(StoreId);
    // console.log("ádasd", req.query, Number(limit));
    console.log("StoreId", StoreId);

    return res.status(200).json(response1);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createPost,
  updatePost,
  getDetailsPost,
  deletePost,
  getAllPost,
  deleteMany,
  getAllPostByStore,
};
