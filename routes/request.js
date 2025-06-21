const express = require('express');
const requestRouter = express.Router();
const {userAuth}=require("../middleware/mid");



requestRouter.post("/sendconnectionRequest",userAuth,async(req,res)=>{
  //send a connection request;
  console.log("send a connection request");
  //read a request who made
    const user = req.user;

  res.send(user.firstName+"send a connection request");

  res.send("connection request");
})


module.exports = requestRouter;