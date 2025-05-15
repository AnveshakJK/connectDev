const express = require("express");

// require("./config/database.js");

const connectDB = require("./config/database");

const app = express();

const User = require("./models/user"); // require models for add data to db in document

const {validateSignupDate} = require("./utils/validate");

const bycrypt = require("bcrypt");

app.use(express.json()); // middleware for handling json data as incoming request get into javascript object for further use it.

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
   const ispassword = await bycrypt.compare(password,user.password);

   if(ispassword){
    res.send("login success");
   }else{
    throw new Error("password not correct");
   }

  }catch(err){
    res.status(400).send("Err "+err.message);
  }
})


app.get("/user",async (req,res)=>{
    const userEmail = req.body.emailId;
  try{
      
      const users = await User.findOne();
  if(users.length === 0)
      res.send("data is not there");
    else{
        res.send(users);
    }
  } catch (err){
    res.status(400).send("something went wrong");
  }
});

//feed api
app.get("/feed",async (req,res)=>{
    const userEmail = req.body.emailId;
  try{
      const users = await User.find({});
  if(users.length === 0)
      res.send("data is not there");
    else{
        res.send(users);
    }
  } catch (err){
    res.status(400).send("something went wrong");
  }
});


//get user by userid 
app.get("/userid",async (req,res)=>{
  const userId = req.body.id;
  // const userId = req.body._id; // not this
  try{
    const user = await User.findById(userId);
    if(!user){
      res.send("some not there data");
    }else{  
      res.send(user);
    }
  }catch(err){
    res.status(400).send("something went wrong");
  } 
})


//delete 
app.delete("/user",async (req,res)=>{
    const userId = req.body.id;
  //  const userId = req.body.userId; // this not work not in schema related id work as by  mongodb given. but while making request in postman userId:"id_no" then it work
    try{
      const user = await User.findByIdAndDelete(userId);
      res.send(user,"user deleted successfully");
    } catch(err){
      res.status(400).send("something went wrong");
    }
});

//update
app.patch("/userupdate/:userId",async (req,res)=>{
  //put for whole replacement as like new item ;
  //patch for name like just part(specific field) of it update to new.
  // const userId = req.body.id;
  // const userId = req.body.userId;
  const userId = req.params?.userId; //?.userid -> if userid not passed then it not failed request
  const data = req.body;

  
  try{
    const ALLOWED_UPDATES=["userId","photourl","about","gender","age","skills"];

    const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));

    //check for every key should be updated in allowing key

    if(!isUpdateAllowed){
      throw new Error("Update not allowed");
    }
  
      // making uservalidtion for skills notenter too much skills , making more entered data by attacker suspecious
      if(data?.skills.length>10)
         throw new Error("skills cannot be more than 10"); 

    // const user = await User.findByIdAndUpdate(userId);
    const user = await User.findByIdAndUpdate(userId,data,{runValidators:true,}); //there two parameter is passed.
   // in run validators if not send correct data then show error as : something went wrongValidation failed: gender: Gender data is not valid
    console.log(user); 
    res.send("user updated successfully");
  } catch(err){
    res.status(400).send("something went wrong, "+err.message);
  }
})


//update with user emailId
app.patch("/userUpwithemail",async (req,res)=>{
  const emailId = req.body.emailId;
  const data = req.body;
  try{
    const user = await User.findOneAndUpdate( { emailId: emailId },data); //this way work return before document
    console.log(user);
    res.send("user updated successfully");
  } catch(err){
    res.status(400).send("something went wrong");
  }
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


