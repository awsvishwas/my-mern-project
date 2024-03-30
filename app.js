const express = require('express')
const app = express();
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

const Campground = require('./models/campgrounds')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const {campgroundSchema, reviewSchema} = require('./schemas')
const Review = require('./models/reviews')

const validateCampground = (req, res, next) =>{
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map( el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else next()
}

const validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else next()
}

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.engine('ejs', ejsMate)

app.listen(3000, ()=>{
    console.log('Running on Port 3000')
})

app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/campgrounds', catchAsync(
    async (req, res)=>{
        const campgrounds = await Campground.find({})
        res.render('campgrounds/index', {campgrounds})
    }
))

app.get('/campgrounds/new', catchAsync(
    async (req, res)=>{
        res.render('campgrounds/new', )
    }
))

app.post('/campgrounds', validateCampground, catchAsync(
    async (req, res)=>{
        const newCampground = new Campground(req.body.campground)
        await newCampground.save()
        res.redirect(`campgrounds/${newCampground._id}`)
    }
))

app.get('/campgrounds/:id', catchAsync(
    async (req, res)=>{
        const {id} = req.params
        const campground = await Campground.findById(id).populate('reviews')
        res.render('campgrounds/show', {campground})
    }
))

app.delete('/campgrounds/:id', catchAsync(
    async (req, res)=>{
        const {id} = req.params
        await Campground.findByIdAndDelete(id)
        res.redirect('/campgrounds')
    }
))

app.get('/campgrounds/:id/edit', catchAsync(
    async (req, res)=>{
        const {id} = req.params
        const campgroundInfo = await Campground.findById(id)
        res.render('campgrounds/edit',{campgroundInfo})

    }
))

app.post('/campgrounds/:id/reviews',validateReview, catchAsync(
    async (req, res)=>{
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review)
        campground.reviews.push(review)
        await review.save()
        await campground.save()
        res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(
    async (req, res)=>{
        const {id, reviewId} = req.params
        await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
        await Review.findByIdAndDelete(reviewId)
        res.redirect(`/campgrounds/${id}`)
    }
))

app.put('/campgrounds/:id', validateCampground, catchAsync(
    async (req,res)=>{
        const {id} = req.params
        const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
        res.redirect(`/campgrounds/${updatedCampground._id}`)
    }
))



app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found.', 404))
})

app.use((err, req, res, next)=>{
    const {statusCode=500,} = err
    if(!err.message) err.message='Something Went Wrong!'
    res.status(statusCode).render('error',{err})
})