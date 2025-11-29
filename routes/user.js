//whenever make a file for like these routes then it must include in express,these.
const express = require("express");
const userRouter = express.Router();

const {userAuth} = require("../middleware/mid");
// const userAuth = require("../middleware/mid"); // give error

const connectionRequestModel = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl";

//get all the pending connection request for the logged in user.
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{ 
    // as get all the logged in user data;
    try{
        const loggedInUser = req.user;
 
        // find give object and findOne give array.
        const connectionRequests = await connectionRequestModel.find({
            toUserId: loggedInUser._id,
            // pass status also otherwise give all like rejected,etc
            status:"interested",
            // as there how to get know that who is sending the request,so for that as use of get fromUserId line by line goes so this become object and traverse each quite heavy task.so instead as do
            // as in connectionschema there do reference connectionRequest to connectionToUser. 
            // ref:"User";

            // as now just populate the reference as want user data here so just populate.

            // .populate("fromUserId")  this just send all the data firstName and LastName elsewise also.as this way overfetching of data happen.filter for this firstName,LastName use. 
          
            // .populate("fromUserId","firstName" "lastName") through string way populate.

        }).populate("fromUserId",["firstName","lastName"]);  // through array way populate.


        res.json({mesage:"Data fetched successfully",data:connectionRequests});
    }catch(err){
       req.statusCode(400).send("ERROR: "+err.message);
    }

}) ;

// find the request that has connnection so status of a logged in user check then in accepted check.
userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
     const loggedInUser = req.user;
    // akshay=>elon=>accepted;
    // elon=>mark accepted;

    const connectionRequests = await connectionRequestModel.find({
        $or:[{ //  logical OR operation 
            toUserId:loggedInUser._id,
            status:"accepted"
        },
        {
            fromUserId:loggedInUser._id,
            status:"accepted",
        },
    ],
    // population is done so filter happen.,but now string use

    // }).populate("fromUserId",USER_SAFE_DATA); // there is bug as there always come fromUserId if suppose fromUserId is not come from.so there toUserId or fromUserId from possible. so there need to populate both the data.

    }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA); // as through chaining is done.

    // const data = connectionRequests.map((row)=>row.fromUserId) ; // getting array only data where the from userid want not to userid ,status,createdAt,updatedAt,etc.

    // res.json({message:"Connection fetch successful" , data:connectionRequests});  // from this fromUserId & toUserId both get. 
     
    // res.json({message:"Connection fetch successful" , data});

    const data = connectionRequests.map((row)=>{
        // if(row.fromUserId._id===loggedInUser._id){ // two mongodb ID comparison is not good,as not work.
          if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId;
    }) ;

    // res.json({message:"Connection fetch successful" , connectionRequests});

    res.json({message:"Connection fetch successful" , data});

    }catch(err){
      res.status(400).send({message:err.mesage});
    }
}); 


module.exports = userRouter;