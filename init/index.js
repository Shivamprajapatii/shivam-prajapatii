const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URl =("mongodb://127.0.0.1:27017/wanderlust"); 

main()
    .then(() => {
    console.log("Database Connected.")
})
    .catch((err) => {
    console.log(err);
});

async function main(){
   await mongoose.connect(MONGO_URl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner :"657c598b5edc85416d5d78ba"}));
    await Listing.insertMany(initData.data);
    console.log("Data Was Initilize");
};

initDB();