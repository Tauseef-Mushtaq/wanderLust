const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review.js");
const Listing = require('../models/listing');
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//Create Review Route
router.post("/", isLoggedIn ,validateReview, wrapAsync(reviewController.createReview));

//delete Review Route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor ,wrapAsync(reviewController.destroyReview));

module.exports = router;