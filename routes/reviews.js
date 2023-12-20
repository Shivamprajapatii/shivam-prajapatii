const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const RevieController = require("../controllers/reviews.js");
const { destroyListing } = require("../controllers/listings.js");
// Post  Riviews Route
router.post("/", 
    validateReview, 
    wrapAsync(RevieController.createReview)
);

// Rating Delete Rout
router.delete("/:reviewId",  // reviewid
isLoggedIn,
isReviewAuthor,
wrapAsync(RevieController.destroyReview)
);


module.exports = router;