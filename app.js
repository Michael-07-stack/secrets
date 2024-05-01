//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

// creating a well defined mongoose schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// encrypting the password of users




const User = new mongoose.model("User", userSchema);

// rendering the home page
app.get("/", function(req, res){
    res.render("home");
});

// rendering the login page
app.get("/login", function(req, res){
    res.render("login");
});

// rendering the register page
app.get("/register", function(req, res){
    res.render("register");
});


app.post("/register", function(req, res){
    // getting the username and password entered by user
    const newUser =new User ({
        email: req.body.username,
        password: md5(req.body.password)
    });
    // saving the details to the database and rendering the secrets page
    newUser.save().then((result) => {
        res.render("secrets");
    }).catch((err) => console.log(err)); 
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);

    // verifying the password to allow or deny access
    User.findOne({email: username}).then((result) => {
        if(result) {
            if(result.password === password){
                res.render("secrets");
            }
        }
    }).catch((err) => {console.log(err)});
});















app.listen(3000, function(){
    console.log("server started on port 3000");
})