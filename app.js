const express = require("express");

// require("./config/database.js");

const connectDB = require("./config/database");

const app = express();

const User = require("./models/user"); // require models for add data to db in document


// route handler for signup
app.post("/signup",async (req,res)=>{
    const user = new User({
        firstName:"Hello",
        lastName:"world",
        emailId:"Helloworld@gmail.com",
        password:"Hello123"
    });

    try{
      await user.save();
        res.send("user added successfully");
    }catch(err){
        res.status(400).send("Error saving the user:"+err.message);
    }    
});

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


