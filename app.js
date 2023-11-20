//jshint esversion:6
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
//const encrypt=require("mongoose-encryption");
//const md5=require("md5");
const bcrypt=require("bcrypt");
require("dotenv").config();
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

let saltRounds=10;

mongoose.set("strictQuery",false);
mongoose.connect(process.env.MONGO_URL);

const userSchema=new mongoose.Schema({
    em:String,
    pwd:String
})
//SECRET string instead of two keys and Encrypt only certain fields,encrypt when call save and decrypt when call find
//userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['pwd'] });

const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.post("/register",function(req,res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser=new User({
            em:req.body.username,
            pwd:hash
        });
        newUser.save(function(err){
            if(err){
               console.log(err);
            }else{
                res.render("secrets");
            }
        });
    });
});
app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({em:username},function(err,foundUser){
        if(foundUser){
            bcrypt.compare(password,foundUser.pwd,function(err, result) {
                if(result===true){
                    res.render("secrets");
                }else{
                    console.log(err);
                }
            });
        }
    });
})
app.listen(3000,function(req,res){
    console.log("Server is running on 3000");
})