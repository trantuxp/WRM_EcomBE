const Post = require("../models/PostModel");

const createPost = (newPost) => {
  return new Promise(async (resolve, reject) => {
    // //console.log("newPost", newPost);

    const { title, content, image, idStore } = newPost;

    try {
      const checkPost = await Post.findOne({
        title: title,
      });
      if (checkPost !== null) {
        resolve({
          status: "ERR",
          message: "The name of Post is already",
        });
        return;
      }
      const newPost = await Post.create({
        title,
        content,
        image,
        idStore,
      });
      if (newPost) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newPost,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updatePost = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPost = await Post.findOne({
        _id: id,
      });
      if (checkPost === null) {
        resolve({
          status: "ERR",
          message: "The Post is not defined",
        });
      }

      const updatedPost = await Post.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedPost,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deletePost = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPost = await Post.findOne({
        _id: id,
      });
      if (checkPost === null) {
        resolve({
          status: "ERR",
          message: "The Post is not defined",
        });
      }

      await Post.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete Post success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyPost = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Post.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete Post success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsPostSv = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findOne({
        _id: id,
      });
      console.log("vo");
      if (post === null) {
        resolve({
          status: "ERR",
          message: "The Post is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESS",
        data: post,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllPostS = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalPost = await Post.countDocuments();

      let allPost = [];

      if (filter) {
        const label = filter[0];
        const TotalallObjectFilter = await Post.find({
          [label]: { $regex: filter[1] },
        });
        const allObjectFilter = await Post.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
        const totalPostFilter = TotalallObjectFilter.length;
        resolve({
          status: "OK",
          message: "Success",
          data: allObjectFilter,
          total: totalPostFilter,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalPostFilter / limit),
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allPostSort = await Post.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: "OK",
          message: "Success",
          data: allPostSort,
          total: totalPost,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalPost / limit),
        });
      }
      if (!limit) {
        allPost = await Post.find().sort({
          createdAt: -1,
          updatedAt: -1,
        });
      } else {
        allPost = await Post.find()
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: allPost,
        total: totalPost,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalPost / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllPostByStoreSv = (StoreId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const AllPostByStoreSv = await Post.find({
        idStore: StoreId,
      });
      console.log(" looi");

      resolve({
        status: "OK",
        message: "Success",
        data: AllPostByStoreSv,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createPost,
  updatePost,
  getDetailsPostSv,
  deletePost,
  getAllPostS,
  deleteManyPost,
  getAllPostByStoreSv,
};
