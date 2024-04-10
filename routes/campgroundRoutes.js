const express = require('express')
const router = express.Router()
const Campground = require('../models/campgrounds')
const catchAsync = require('../utils/catchAsync')
const multer = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({storage})

const {isLoggedIn, validateCampground, isAuthor} = require('../middleware')
const campgroundController = require('../controllers/campgrounds')

router.route('/')
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundController.addCampgroundFormPost))
    // .post(upload.array('image'), (req, res)=>{
    //     console.log(req.body, req.files)
    //     res.send('It workd!')
   // })

router.get('/new', isLoggedIn, campgroundController.addCampgroundForm)
    
router.route('/:id')
    .get(catchAsync(campgroundController.showCampgroundInfo))
    .put(isLoggedIn, isAuthor, upload.array('image'),validateCampground, catchAsync(campgroundController.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.editCampground))

module.exports = router