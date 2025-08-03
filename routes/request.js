const express = require('express');
const requestRouter = express.Router();
const {userAuth}=require("../middleware/mid");
const connectionRequestModel = require('../models/connectionRequest');
const User = require("../models/user");


// requestRouter.post("/sendconnectionRequest",userAuth,async(req,res)=>{
//   //send a connection request;
//   console.log("send a connection request");
//   //read a request who made
//     const user = req.user;

//   res.send(user.firstName+"send a connection request");

//   res.send("connection request");
// })

 // "/request/send/interested/:toUserId" --> as making this dynamic for left and right swipe so :status used.
 
requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
  
  try{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

  const allowedStatus = ["ignored","interested"];
  if(!allowedStatus.includes(status)){
    return res.status(400).json({message:"invalid status type: "+status});
  }

 const toUser = await User.findById(toUserId);
 if(!toUser){
  return res.status(404).json({message:"user not found"});
 }

  const existingConnectionRequest = await connectionRequest.findOne({$or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}],}); 
   if(existingConnectionRequest){
    return res.status(400).send({message:"connection request Already Exist!!"});
   }


    const connectionRequest = new connectionRequestModel({
      fromUserId,
      toUserId,
      status
    });

    const data = await connectionRequest.save();

    res.json({message:req.user.firstName+"is"+status+"in"+toUser.firstName,data});
  } catch(err){
    req.status(400).send("Error:"+err.message);
  }

  // res.send(user.firstName+"send a connection request");
});

module.exports = requestRouter;