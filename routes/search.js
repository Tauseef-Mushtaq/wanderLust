const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");


router.get("/", wrapAsync(async (req, res) => {
    let { q } = req.query;
    if (!q) {
        req.flash("error", "Please enter a search term.");
        return res.redirect("/listings");
    }
    // Case-insensitive, partial match search on title
    let searchListings = await Listing.find({ title: { $regex: q, $options: "i" } });
    if (searchListings.length === 0) {
        req.flash("error", "No listings found for your search term.");
        return res.redirect("/listings");
    }
    res.render("listings/search.ejs", {searchListings, q});
}));

module.exports = router;