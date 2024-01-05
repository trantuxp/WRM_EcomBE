const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/SearchController");

router.post("/create/", SearchController.createSearch);
router.get("/get-search-by-user/:id", SearchController.getSearchByUser);

module.exports = router;
