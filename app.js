const express = require("express");

// require("./config/database.js");

const connectDB = require("./config/database");

const app = express();

const User = require("./models/user"); // require models for add data to db in document

app.use(express.json()); // middleware for handling json data as incoming request get into javascript object for further use it.

app.post("/signup",async (req,res)=>{
    // const user = new User({
    //     firstName:"Hello",
    //     lastName:"world",
    //     emailId:"Helloworld@gmail.com",
    //     password:"Hello123"
    // });

//    console.log(req); // get whole data incoming request
//    console.log(req.body);
    const user = new User(req.body);

    try{
      await user.save();
        res.send("user added successfully");
    }catch(err){
        res.status(400).send("Error saving the user:"+err.message);
    }    
});

// get route for read data from database by find model by using filter - email.
app.get("/user",async (req,res)=>{
    const userEmail = req.body.emailId;
  try{
      // console.log(userEmail);
      // const users = await User.find({emailId:userEmail});
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
app.patch("/userupdate",async (req,res)=>{
  //put for whole replacement as like new item ;
  //patch for name like just part(specific field) of it update to new.
  // const userId = req.body.id;
  const userId = req.body.userId;
  const data = req.body;
  try{
    // const user = await User.findByIdAndUpdate(userId);
    const user = await User.findByIdAndUpdate(userId,data); //there two parameter is passed.
    console.log(user);
    res.send("user updated successfully");
  } catch(err){
    res.status(400).send("something went wrong");
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


