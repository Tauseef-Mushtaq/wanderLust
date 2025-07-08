const Listing = require("../models/listing");
const axios = require("axios");

module.exports.index = async (req, res) => {
   let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings}); 
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path :"reviews", populate : {path : "author"},}).populate("owner");
    if(!listing){
         req.flash("error", "Listing you requested for does not exist!");
         return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", {listing});
}

module.exports.createListing = async (req, res) => {

    let url = req.file.path; // Get the image URL from the uploaded file
    let filename = req.file.filename; // Get the filename from the uploaded file
    let newListing =  new Listing (req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the logged-in user
    newListing.image = {url, filename}; // Set the image field with the URL and filename
    let geocoded = null;
    if (newListing.location) {
        try {
            const maptilerApiKey = process.env.MAP_API_KEY; // Set your MapTiler API key in environment variables
            const response = await axios.get(
                `https://api.maptiler.com/geocoding/${encodeURIComponent(newListing.location)}.json?key=${maptilerApiKey}` // Use the API key from environment variables
            );
            if (response.data && response.data.features && response.data.features.length > 0) {
                geocoded = response.data.features[0].geometry.coordinates; // [lng, lat]
                newListing.geometry = {
                    type: "Point",
                    coordinates: geocoded
                };
            }
        } catch (err) {
            console.error("MapTiler geocoding error:", err.message);
        }
    }
    // Ensure geometry is always set as an object with type and coordinates
    if (geocoded) {
        newListing.geometry = {
            type: "Point",
            coordinates: geocoded
        };
    } else {
        newListing.geometry = {
            type: "Point",
            coordinates: [0, 0] // Default coordinates if geocoding fails
        };
    }
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");    
}

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
         req.flash("error", "Listing you requested for does not exist!");
         return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_scale,w_200"); // Adjust the URL to display a smaller image
   
    res.render("./listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new: true});
    
    // Update image if a new file is uploaded
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
    }

    // Update geocoding if location is changed
    if (req.body.listing.location) {
        try {
            const maptilerApiKey = process.env.MAP_API_KEY;
            const response = await axios.get(
                `https://api.maptiler.com/geocoding/${encodeURIComponent(req.body.listing.location)}.json?key=${maptilerApiKey}`
            );
            if (response.data && response.data.features && response.data.features.length > 0) {
                const geocoded = response.data.features[0].geometry.coordinates; // [lng, lat]
                listing.geometry = {
                    type: "Point",
                    coordinates: geocoded
                };
            } else {
                listing.geometry = {
                    type: "Point",
                    coordinates: [0, 0]
                };
            }
        } catch (err) {
            console.error("MapTiler geocoding error:", err.message);
            listing.geometry = {
                type: "Point",
                coordinates: [0, 0]
            };
        }
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
   let deleteListing =  await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
}