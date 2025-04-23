const express = require("express");
const app = express();

const {adminAuth,userAuth} = require("./middleware/mid.js");

// if this change order like that then err catch then main "/" will handle otherwise "/getuserdata" will handle. if there error and same order this follow "/" then "/getuserdata" then get error as some thing etc, but order "/" then "/getuserdata" change then it will handle it. 

// app.use("/",(err,req,res,next)=>{
//     if(err){
//       // as log error also by just alert or something like that for contain more information.
//       res.status(500).send("something went wrong");
//     }
//   })


// generally writing code in try catch is good way to write code but if some unhandled error then do below that not handled.
app.get("/getuserdata",(req,res)=>{
    try{


    throw new Error("dvbzhjf");
    res.send("user Data sent");
    }catch(err){

    res.status(500).send(err.message);

    }
    // throw new Error("dvbzhjf");
    // res.send("user Data sent");
});


// order in pass this argument as it is , order must be like this as it managed by express dynamically . if 2 arg pass then it be (req,res) but in 4 arg then like this way use.if error then handled like this .this also a middleware.

// *) this will put in last of code so that if any err that not hanlde by other try catch then it will handle and as we where problem.
app.use("/",(err,req,res,next)=>{
  if(err){
    // as log error also by just alert or something like that for contain more information.
    res.status(500).send("something went wrong");
  }
})

app.listen(3000,()=>{
    console.log("Listen to port 3000");
});


