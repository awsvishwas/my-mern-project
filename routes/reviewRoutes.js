const express = require('express')
const router = express.Router({mergeParams: true})

const reviewController = require('../controllers/reviews')
const catchAsync = require('../utils/catchAsync')

const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.addReview))
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview))

module.exports = router