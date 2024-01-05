const Search = require("../models/SearchModel");

const createSearch = (id, content) => {
  return new Promise(async (resolve, reject) => {
    try {
      const idUser = id;
      const checkSearch = await Search.findOne({
        content: content,
        idUser: id,
      });

      if (checkSearch !== null) {
        resolve({
          status: "ERR",
          message: "The Search name is already",
        });
      } else {
        console.log("Search", id, content);

        const createdSearch = await Search.create({
          content,
          idUser,
        });

        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdSearch,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getSearchByUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Search", id);

      const SearchByUser = await Search.find({ idUser: id })
        .limit(5)
        .sort({ createdAt: -1, updatedAt: -1 });

      if (SearchByUser === null) {
        resolve({
          status: "ERR",
          message: "The Search is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESS",
        data: SearchByUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createSearch,
  getSearchByUser,
};
