 const jwt = require("jsonwebtoken");
const User = require("../models/user");

 const userAuth = async(req,res,next)=>{
 try { //Read the token from the req cookies

   const {token}=req.cookies;
   const decodeobj = await jwt.verify(token,"Jayank@123$");

   // validate the token 

   const {_id}=decodeobj;
   const user = await User.findById(_id);

   // find the username of particular if for user is there or not
   
   if(!user){
      throw new Error("User not found");
   }
   req.user=user;
   next(); // to move to next handler, as there(req,res)=>{};
}catch(err){
   res.status(400).send("Error"+err.message);
}
 };

 module.exports={userAuth};