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

//making a user receive request wheather it accept or reject, there in (path,middleware,next());
requestRouter.post("/request/review/:status/:requestId",
  userAuth,
  async(req,res)=>{
    try{

      const loggedInUser = req.user;
      const {status,requestId} = req.params;

      // to user must loggedIn then it able to accept that request
      // but acceptance happen if "interested" status is there. 
     
      //if once time it rejected then unable to make that request then it have send request again.as can't reverse
       
      //validate status as not zibrish send
       //akshay => elon
       // is elon loggedinId user == toUserId
       // status interested
       // request Id should be valid

        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
          return res.status(400).json({message:"status not allowed!"});
        }

        //requestId check
        const connectionRequest = await connectionRequestModel.findOne({
          _id:requestId,
          toUserId:loggedInUser._id, 
          status:"interested",
        });

         if(!connectionRequest){
          return res
          .status(404)
          .json({message:"connection request not found!"});
         }

         connectionRequest.status = status; // status in allowed status

         const data = await connectionRequest.save(); // before save there must do check,sanitize the data i.e why at last in there insert.

         res.json({message:"connection request" + status,data});

    }catch(err){
      res.status(400).send("ERROR: "+err.message);
    }
  }
);

module.exports = requestRouter;


// thought process of PUT & GET;
//