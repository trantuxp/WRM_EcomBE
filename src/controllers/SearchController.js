const SearchService = require("../services/SearchService");

const createSearch = async (req, res) => {
  try {
    const { id, content } = req.body;
    if (!content) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await SearchService.createSearch(id, content);
    // console.log("Search", id, content);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getSearchByUser = async (req, res) => {
  try {
    const id = req.params.id;

    const response1 = await SearchService.getSearchByUser(id);

    return res.status(200).json(response1);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createSearch,
  getSearchByUser,
};
