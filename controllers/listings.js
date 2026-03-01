  const Listing = require("../models/listing.js");
  const axios = require("axios");

  // Render New Form
  module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  };

  // Show Listing
  module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing does not exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  };

  // Create Listing
  module.exports.createListing = async (req, res, next) => {
    try {
      const { location } = req.body.listing;

      const geoUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${process.env.MAP_KEY}`;
      const response = await axios.get(geoUrl);

      if (!response.data.features || response.data.features.length === 0) {
        req.flash("error", "Invalid location");
        return res.redirect("/listings/new");
      }

      const coordinates = response.data.features[0].geometry.coordinates;

      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;

      // SAFE IMAGE
      if (req.file) {
        newListing.image = {
          url: req.file.path,
          filename: req.file.filename,
        };
      } else {
        newListing.image = {
          url: "https://via.placeholder.com/600x400",
          filename: "default",
        };
      }

      newListing.geometry = {
        type: "Point",
        coordinates: coordinates,
      };

      await newListing.save();

      req.flash("success", "New Listing Created!");
      res.redirect(`/listings/${newListing._id}`);

    } catch (err) {
      next(err);
    }
  };

  // Edit Form
  module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image?.url;

  if (originalImageUrl) {
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  }

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

  // Update Listing
  module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });

    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
      await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  };

  // Delete Listing
  module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  };

  // Index
  module.exports.index = async (req, res) => {
    const { search } = req.query;

    let allListings;

    if (search) {
      allListings = await Listing.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { country: { $regex: search, $options: "i" } },
        ],
      });
    } else {
      allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings, search });
  };