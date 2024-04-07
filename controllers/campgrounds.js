const Campground = require('../models/campgrounds')

const index = async (req, res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

const addCampgroundForm = (req, res)=>{
    res.render('campgrounds/new' )
}

const addCampgroundFormPost = async (req, res)=>{
    const newCampground = new Campground(req.body.campground)
    newCampground.author = req.user._id
    await newCampground.save()
    req.flash('success', 'Successfully added a new campground!')
    res.redirect(`campgrounds/${newCampground._id}`)
}

const showCampgroundInfo = async (req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id).populate(
       {
        path: 'reviews', 
        populate: {
            path: 'author'
        }
    }).populate('author')
    if(!campground){
        req.flash('error', 'Campground Not Found!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}

const editCampground = async (req, res)=>{
    const {id} = req.params
    const campgroundInfo = await Campground.findById(id)
    if(!campgroundInfo){
        req.flash('error', 'Campground Not Found!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campgroundInfo})

}

const updateCampground =  async (req,res)=>{
    const {id} = req.params
    const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('success', 'Successfully updated the campground!')
    res.redirect(`/campgrounds/${updatedCampground._id}`)
}

const deleteCampground = async (req, res)=>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted the campground!')
    res.redirect('/campgrounds')
}

module.exports = {index, addCampgroundForm, addCampgroundFormPost,
 showCampgroundInfo, editCampground, updateCampground, deleteCampground}

