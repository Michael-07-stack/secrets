//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
    // using bcrypt to hash the password
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
         // getting the username and password entered by user
        const newUser =new User ({
            email: req.body.username,
            password: hash
        });
        // saving the details to the database and rendering the secrets page
        newUser.save().then((result) => {
            res.render("secrets");
        }).catch((err) => {console.log(err)}); 
    });
   
   
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    // verifying the password to allow or deny access
    User.findOne({email: username}).then((results) => {
        if(results) {
            bcrypt.compare(password, results.password, function(err, result) {
               if(result == true){
                    res.render("secrets");
               }
            }); 
            
        }
    }).catch((err) => {console.log(err)});
});















app.listen(3000, function(){
    console.log("server started on port 3000");
})