const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email : {
        type: String,
        required : true, 
    },   // Mongoose aautomaticaly Usename and Password Field Creae Kar lega
});


userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);

