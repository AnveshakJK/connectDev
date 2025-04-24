const mongoose = require('mongoose');

// not correct way to do as some time connection database might happen or not there promise as return so it better to put in async and await.
// mongoose.connect("mongodb+srv://jayankkumar3101:hHOBEStzoaKIRq9Q@learndev.8jtmxup.mongodb.net/connectDev");

/* 
// this way not good as server connection before happen then later connection of database happen. this might be some api call missout without database.

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://jayankkumar3101:hHOBEStzoaKIRq9Q@learndev.8jtmxup.mongodb.net/connectDev");
} ;

connectDB()
    .then(()=>{
        console.log("Database connected successfully");
    })
    .catch((err)=>{
        console.log("Database cannot be connected");
    });

*/ 


const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://jayankkumar3101:hHOBEStzoaKIRq9Q@learndev.8jtmxup.mongodb.net/connectDev"
    );
} ; 

module.exports = connectDB;


