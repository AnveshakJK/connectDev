const express = require("express");

// require("./config/database.js");

const connectDB = require("./config/database");

const app = express();

const User = require("./models/user"); // require models for add data to db in document

const {validateSignupDate} = require("./utils/validate");

const bycrypt = require("bcrypt");

const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");

const {userAuth}=require("./middleware/mid");

app.use(express.json()); // middleware for handling json data as incoming request get into javascript object for further use it.

app.use(cookieParser());

app.post("/signup",async (req,res)=>{

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


//login api

app.post("/login", async (req,res)=>{
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

     res.cookie("token",token,{expires:new Date(Date.now()+1*60000)}); // expiring a cookie after 1min
    res.send("login success");
   }else{
    throw new Error("password not correct");
   }

  }catch(err){
    res.status(400).send("Err "+err.message);
  }
})


//profile api
app.get("/profile",userAuth,async(req,res)=>{
  try{ 

    const user = req.user;
 
  res.send(user);

}  catch(err){
res.status(400).send("Error : "+err.message);
}
}) ;


app.post("/sendconnectionRequest",userAuth,async(req,res)=>{
  //send a connection request;
  console.log("send a connection request");
  //read a request who made
    const user = req.user;

  res.send(user.firstName+"send a connection request");

  res.send("connection request");
})


// connection for db
connectDB()
    .then(()=>{
        console.log("Database connected successfully");
        app.listen(3000,()=>{
            console.log("Listen to port 3000");
        });
    })
    .catch((err)=>{
        console.log("Database cannot be connected");
    });

// app.listen(3000,()=>{
//     console.log("Listen to port 3000");
// });


