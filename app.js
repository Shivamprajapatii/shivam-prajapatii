if(process.env.NODE_ENV != "production"){
   require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const reviewsRouter = require("./routes/reviews.js"); 
const listingsRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");



const db_Url = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Database Connected.")
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(db_Url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: db_Url,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error ",()=> {
    console.log("eroor in Mongo SESSION STORE",err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized : true,
    cookie : {
        exppires : Date.now() + 7 * 24 * 60 * 60 * 1000, // 7days 24 hourse 60 miniute 60 second 1000 mili second
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}


// app.get("/", (req, res) => {
//     res.send("Hello I am Root! ")
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());    


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; 
    next();
});


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


app.all("*",(req,res,next) => {
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next) => {
    let { statusCode = 500, message = "Somthing Happen"} = err;
    res.status(statusCode).render("error.ejs",{message});
}); 

app.listen(8080, () => {
    console.log("Server 8080 is On! it is listinig to Port 8080");
})





