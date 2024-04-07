const express = require('express')
const router = express.Router()
const Campground = require('../models/campgrounds')
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware')
const campgroundController = require('../controllers/campgrounds')

router.route('/')
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgroundController.addCampgroundFormPost))

router.get('/new', isLoggedIn, campgroundController.addCampgroundForm)
    
router.route('/:id')
    .get(catchAsync(campgroundController.showCampgroundInfo))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundController.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.editCampground))

module.exports = router