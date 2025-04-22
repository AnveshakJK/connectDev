const express = require("express");
const app = express();

const {adminAuth,userAuth} = require("./middleware/mid.js");

// middleware use 
app.use("/admin",adminAuth);


app.post("/user/login",(req,res)=>{
    res.send("user logged success.");  // this user auth no required as middleware customize this.
})

// it good if middle of user fails then not worry this will res.send as not going to api.
app.use("/user",userAuth,(req,res)=>{
    res.send("user data send");
});

app.get("/admin/getAllData",(req,res)=>{
    res.send("All data send");
})


app.get("/admin/getDeleteData",(req,res)=>{
    res.send("All data delete");
})

app.listen(3000,()=>{
    console.log("Listen to port 3000");
});


