//jshint esversion:6
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
require("dotenv").config();
const app=express();

mongoose.set("strictQuery",false);
mongoose.connect(process.env.MONGO_URL);

const userSchema={
    em:String,
    pwd:String
}
const User=new mongoose.model("User",userSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

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
    const newUser=new User({
        em:req.body.username,
        pwd:req.body.password
    });
    newUser.save(function(err){
        if(err){
           console.log(err);
        }else{
            res.render("secrets");
        }
    });
});
app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({em:username},function(err,foundUser){
        if(foundUser){
            if(foundUser.pwd===password){
                res.render("secrets");
            }
            else{
                console.log(err);
            }
        }
    })
})
app.listen(3000,function(req,res){
    console.log("Server is running on 3000");
})