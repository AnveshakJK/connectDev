const express = require('express');

const authRouter = express.Router();
const bycrypt = require("bcrypt");
const {validateSignupDate} = require("../utils/validate");
const User = require("../models/user"); // require models for add data to db in document
const jwt = require("jsonwebtoken");


authRouter.post("/signup",async (req,res)=>{

try{
   //validate the data 
   validateSignupDate(req);

  // const {password} = req.body;
  const {firstName,lastName,emailId,password}=req.body; // before to use there must difined first

   // encrypt the data 
  const passwordhased = await bycrypt.hash(password,10);
 console.log(passwordhased);

   // store the password as in hashed 

    // const user = new User(req.body); //it not good practice to add like way req.body pass all thing iside this. do as,,
  const  user = new User({
    firstName,
    lastName,
    emailId,
    password:passwordhased,
  })
   
      if(user?.skills.length>10)
        throw new Error("skills cannot be more than 10"); 

      await user.save();
        res.send("user added successfully");
    }catch(err){
        res.status(400).send("Error saving the user:"+err.message);
    }    
});

authRouter.post("/login", async(req,res)=>{
  try{

   const {emailId,password}=req.body;

   // fistly check enter email id is correct or not 
   const user = await User.findOne({emailId:emailId});

   if(!user){
    throw new Error("Email id not valid.");
   }
  // corresponding eamilid check password weather the detail is correct or not, password that compare(send , hashed password) function in bcrypt. 
  //  const ispassword = await bycrypt.compare(password,user.password); 

  //***  password for also used schema method
  const ispassword = await user.ValidatePassword(password);

   if(ispassword){
    // create a jwt token  - jwt tokein is divided into 3token header,payload,signature 
    //require a jsonwebtoken developed by auth0;
     
      //const token = await jwt.sign({_id:user._id} , "Jayank@123$"); 

      // const token = await jwt.sign({_id:user._id} , "Jayank@123$",{expiresIn:"1d"}); // id and secret password for token in want of conversion // later added expire jwt

      //*** user schema method

      const token = await user.getJwt();


      console.log(token);

     res.cookie("token",token,{expires:new Date(Date.now()+4*60000)}); // expiring a cookie after 1min
    // res.send("login success");
    res.send(user); // after login success send user data to frontend,get back of user data in login.jsx.
   }else{
    throw new Error("password not correct");
   }

  }catch(err){
    res.status(400).send("Err "+err.message);
  }
});

//logout api call
authRouter.post("/logout",async(req,res)=>{
  res.cookie("token",null,{expires:new Date(Date.now())});
  res.send("logout successfully!");
});


module.exports = authRouter;