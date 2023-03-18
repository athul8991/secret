//jshint esversion:6
require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption')


const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')


// db connection
mongoose.connect("mongodb+srv://athuls8991:process.env.DBPASS@cluster0.ityc9mx.mongodb.net/userDb",{useNewUrlParser:true})
    .then(()=>{
         console.log("Connected");
    
        
    }).catch((err)=>{
        console.log("Connect Error : "+err);

    })

// user schema

const userSchema =new mongoose.Schema({
    email:String,
    password:String
})
// encrypting

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']})
// user model

const User = mongoose.model("User",userSchema)
        
// home

app.get("/",(req,res)=>{
    res.render("home")
})
//get login

//get register

app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",(req,res)=>{
    const email = req.body.username;
    const password = req.body.password;

    User.find({email:email}).then((result)=>{
        console.log(result.length);
        if(result.length===0){
            
            const newUser = new User({
                email:email,
                password:password
               })
               newUser.save().then(()=>{
                res.render("secrets");
               }).catch((err)=>{
                res.send(err);
               })
            
           
         }else{
            res.send("email allready in")
             

         }
    }).catch((err)=>{
        res.send(err)
    })
});

// login
let loginerror ='';
app.get("/login",(req,res)=>{
    res.render("login",{passErr:loginerror});
});

app.post("/login",(req,res)=>{
    loginerror ='';
    const userName = req.body.username;
    const pass = req.body.password

    User.findOne({email:userName}).then((result)=>{
        if(result ){
            if(result.password === pass){
            res.render("secrets");
            }else{
               
                loginerror ="password Denied";
                res.redirect("/login")
            }
        }else{
            console.log("check Details");
            loginerror ="Please check your enter details"
            res.redirect("/login")
        }
    }).catch((err)=>{
        res.send(err);
    })
    
})



app.listen(process.env.PORT||3000,(err)=>{
    if (err){
        console.log(err);
    }else{
        console.log("Server started ");
    }
})
