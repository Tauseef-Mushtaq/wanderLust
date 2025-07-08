const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData = require('./data.js');

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderLust");
}

const initDB = async () => {
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({...obj, owner : "68663687985912eec0361a97"}))
   await Listing.insertMany(initData.data);
   console.log("Database initialized with sample data");
};

initDB();