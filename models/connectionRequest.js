const mongoose = require('mongoose');

// as making connection request schema , and also make it required to true for connection between two for these necessary.

const connectionRequestSchema = new mongoose.Schema({
   fromUserId:{
    type:mongoose.Schema.Types.ObjectId , 
    ref:"User",// managing a refernce link between fromUserId to User collection which in schema.
    required : true,
   },
   toUserId:{
    type:mongoose.Schema.Types.ObjectId ,
    ref:"User",
    required : true,
   },
   status:{
    type:String,
    required : true,
    enum:{
        values:["ignore","interested","accepted","required"],
        message:`{VALUE} is incorrect status type`
    }
   }
},{
    timestamps:true,
});

connectionRequestSchema.index({fromUserId:1,toUserId:1});

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    //chech if userID is same toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection request to yourself!");
    }
    next();
});

// res.json({meassage:requestRouter.firstName+"is"+status+"in"+toUser.firstName , data})

const connectionRequestModel = new mongoose.model("connectionRequest",connectionRequestSchema);

module.exports = connectionRequestModel;

 