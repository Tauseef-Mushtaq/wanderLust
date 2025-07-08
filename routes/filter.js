const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");

router.get("/", wrapAsync(async (req, res) => {
  const { category } = req.query;

  let query = {};
  if (category) {
    query.category = category.toLowerCase();
  }

  const searchListings = await Listing.find(query);
  res.render("listings/filter", { searchListings, category });
}));

module.exports = router;