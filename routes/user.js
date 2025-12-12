//whenever make a file for like these routes then it must include in express,these.
const express = require("express");
const userRouter = express.Router();

const {userAuth} = require("../middleware/mid");
// const userAuth = require("../middleware/mid"); // give error

const connectionRequestModel = require("../models/connectionRequest");

const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photourl about gender age";// this is used to populate only safe data not password,emailId,etc.that need to be show.

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


//feed api request make 
// /feed/:skip/etc   ,, / /feed?page=1&limit=10   -> these are params; ,see it req.params and req.query that get from api page request.
// userRouter.get("/feed?page=1&limit=10",userAuth,async(req,res)=>{
    userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
       //*(akshay => elon) requested then again request not seen like accepted not show again on feed , akshay shouldn't see of itself also.exclude all which not want to see.

       //Todo: ->) usern't should see all the user cards except 
       //0) his on card.
       //1) his connections
       //2) ignored people
       //3) already sent the connection request 

       // Example: rahul = [akshay,elon,mark,donald,dhoni,virat]
       // rahul-> akshay , rahul->elon (sent connection) 
       // now it see rahul = [mark,donald,dhoni,virat]
       // if r->akshay-> rejected ,, r->elon->accepted  (so no there not see each other profile as this.)
       // elon = [mark,donald,dhoni,virat,akshay]


       // find loggedin user
       const loggedInUser = req.user;

    //    const page = parseInt(req.params.page) || 1;  // take from query not params
       const page = parseInt(req.query.page) || 1;
    //    const limit = parseInt(req.query.limit) || 10;
       let limit = parseInt(req.query.limit) || 10; // by default limit is 10 if not pass any query. as we have to sanitize the data suppose as far limit exceeded then it take more time and funtion suppose 100000.

       limit = limit>50? 50:limit;
       const skip = (page-1)*limit;

       // find all connection request(sent+received)
       const connectionRequests = await connectionRequestModel.find({
        $or:[
            {fromUserId:loggedInUser},
            {toUserId:loggedInUser},
        ],
        // select is help to what data i want to need then selectively only show.
        //as not need to populate but as just see. 
       }).select("fromUserId toUserId")
    //    .populate("fromUserId","firstName")
    //    .populate("toUserId","firstName");

    // as now segrate this , blocked user
    // set data structure is like an array ,used like 
    // [A,B,C,D,E] unique element it store it,value repeat if then ignore it.
    const hideUsersFromFeed = new Set();
    // loop through all these connection request
    connectionRequests.forEach(req => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
    }); 
     console.log(hideUsersFromFeed);  // as get of data which is need to hide from feed.

     //now from that user hide find it by use reverseQuery method 
     // as now make a db call where all user from to find which id is not in array there (nin)id. 
     const users = await User.find({
        // nin -> not in user Id,there also one condition that not itself.
        $and:[
       { _id:{$nin:Array.from(hideUsersFromFeed) }},
       {_id:{$ne:loggedInUser._id}}, //ne:->not in this array.(itself id).All these get from mongoDb query documentation ne,nin,etc.
        ],
        // only necessary item that need to be show not others.
     }).select(USER_SAFE_DATA).skip(skip).limit(limit);   // so this data need to send back to user which in there list. // and in there is not pass any like skip then it be by default 0.

    //    res.send(connectionRequests);
    //res.send(users);// always send in json format as get to help error handle;
    res.json({data:users});

    } catch(err){
        res.status(400).json({message:err.message});
    }
}); 

// 

module.exports = userRouter;