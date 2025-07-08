const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },
    category: {
    type: String,
    required: true,
    enum: [
      'trending',
      'rooms',
      'iconic',
      'mountains',
      'castles',
      'pools',
      'camping',
      'arctic',
      'boats',
      'domes'
    ]
  },
});

listingSchema.post("findOneAndDelete", async (lisitng) => {
if(lisitng){
    await Review.deleteMany({_id: {$in: lisitng.reviews}});
}
});

const Listing = new mongoose.model("Listing", listingSchema);
module.exports = Listing;