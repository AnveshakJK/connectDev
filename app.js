const express = require("express");

// require("./config/database.js");

const connectDB = require("./config/database");

const app = express();

const User = require("./models/user"); // require models for add data to db in document

app.use(express.json());
//making a route handler for passing dynamic data into api
//in postman passing body in raw data as in JSON format.
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


