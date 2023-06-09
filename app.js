//jshint esversion:6
//installed npm i
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt =require('mongoose-encryption');
const port = 3001;
 
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true }); 

const userSchema = new mongoose.Schema({
    email: String ,
    password: String
});


const secret ="Thisisourlittlesecrete.";
userSchema.plugin(encrypt,{secret:secret, encryptedFields: ["password"]})


const User = new mongoose.model("User",userSchema);
 
app.get("/",function(req,res){
    res.render("home");
}); 

app.get("/login",function(req,res){
    res.render("login");
}); 

app.get("/register",function(req,res){
    res.render("register");
}); 

app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username ,
        password: req.body.password
    });
    newUser.save()
    .then(() => {res.render('secrets')})
    .catch(() => {console.log("Error while saving data")})
});

app.post("/login", function(req,res){
    const username = req.body.username ;
    const password = req.body.password ;

    User.findOne({email:username})
    .then(function(founduser){
        if(founduser.password === password){
            res.render("secrets");
            console.log("successfully logged in");
        }
    })
    .catch(function(err){
        console.log(err)
    });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});