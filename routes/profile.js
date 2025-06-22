const express = require('express');
const profileRouter = express.Router();
const {userAuth}=require("../middleware/mid");
const {validateEditProfileData} = require("../utils/validate");


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
  try{ 

    const user = req.user;
 
  res.send(user);

}  catch(err){
res.status(400).send("Error : "+err.message);
}
});

// /profile/edit
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
  try{
      
    if(!validateEditProfileData(req)){
        throw new Error("invalid edit request");
    }

    const logUser = req.user;
    console.log(logUser);

    //logUser.firstName = req.body.firstName;// not good to edit one by one so instead use method
    
    Object.keys(req.body).forEach(key=>{
      logUser[key] = req.body[key]
    });

    // console.log(logUser);
    await logUser.save();
    res.send({message:`${logUser.firstName} you profile updated successfully `,data:logUser});


  }catch(err){
    res.status(400).send("Error: "+err.message);
  }
});

module.exports = profileRouter;