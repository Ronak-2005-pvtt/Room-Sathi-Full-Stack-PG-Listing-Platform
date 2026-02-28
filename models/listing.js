const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename:String,
  },
  price: Number,
  location: String,
  category: String,
  country: String,

  roomType: {
    type: String,
    enum: ["Single", "Double", "Triple","All are available"],
    required: true,
  },

  gender: {
    type: String,
    enum: ["Boys", "Girls", "Co-ed"],
    required: true,
  },

  MealPlan: {
    type: String,
    enum: ["Meals Included", "No Meals"],
    required: true,
  },

  wifi: {
    type: String,
    enum: ["Available", "Not Available"],
    required: true,
  },



  geometry: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;