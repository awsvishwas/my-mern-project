const Campground = require("../models/campgrounds");
const { cloudinary } = require("../cloudinary/index");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });

const index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

const addCampgroundForm = (req, res) => {
  res.render("campgrounds/new");
};

const addCampgroundFormPost = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send()
  const newCampground = new Campground(req.body.campground);
  newCampground.geometry = geoData.body.features[0].geometry
  newCampground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCampground.author = req.user._id;
  await newCampground.save();
  req.flash("success", "Successfully added a new campground!");
  res.redirect(`campgrounds/${newCampground._id}`);
};

const showCampgroundInfo = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Campground Not Found!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

const editCampground = async (req, res) => {
  const { id } = req.params;
  const campgroundInfo = await Campground.findById(id);
  if (!campgroundInfo) {
    req.flash("error", "Campground Not Found!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campgroundInfo });
};

const updateCampground = async (req, res) => {
  const { id } = req.params;
  const { deleteImages } = req.body;
  const updatedCampground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  updatedCampground.images.push(...imgs);
  await updatedCampground.save();
  if (deleteImages) {
    for (let filename of deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await updatedCampground.updateOne({
      $pull: { images: { filename: { $in: deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated the campground!");
  res.redirect(`/campgrounds/${updatedCampground._id}`);
};

const deleteCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  camp.images.forEach(async (img) => {
    await cloudinary.uploader.destroy(img.filename);
  });
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the campground!");
  res.redirect("/campgrounds");
};

module.exports = {
  index,
  addCampgroundForm,
  addCampgroundFormPost,
  showCampgroundInfo,
  editCampground,
  updateCampground,
  deleteCampground,
};
