const Review = require('../models/reviews')
const Campground = require('../models/campgrounds')

const addReview = 
async (req, res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'You gave a review!')
    res.redirect(`/campgrounds/${campground._id}`)
}

const deleteReview = 
async (req, res)=>{
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review Successfully Deleted!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports = {
    addReview,
    deleteReview
}