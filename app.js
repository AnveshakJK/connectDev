const express = require("express");
const app = express();

/*
app.use("/user",(req,res,next)=>{
    // route handler 
    console.log("route handler from 1");
    
    res.send("route handler 1"); 
    next(); 
    // //if not in res.send then not further as line by line code it excute then call stack get empty not in there . because express not known what to do next but this in node not problem . so use next(); and also pass in argument also .
    
    // error get by this
    // next();
    // res.send("route handler 1"); 
}, 
  (req,res)=>{
    console.log("route handler from 2");
    res.send("response 2");
    // next();
},
  (req,res)=>{
    console.log("route handler from 3");
    res.send("response 3");
    // next();
},
  (req,res)=>{console.log("route handler from 4");
    res.send("response 4");
    next();  // at last in do then get error due to next not route handler to call this , call stack get empty.
}
); 
*/

app.use("/user",(req,res,next)=>{
    // route handler 
    console.log("route handler from 1");
    
    // res.send("route handler 1"); 
    next(); 
}, [
  (req,res,next)=>{
    console.log("route handler from 2");
    res.send("response 2");
    next();
},
  (req,res)=>{
    console.log("route handler from 3");
    res.send("response 3");
    // next();
}],
  (req,res)=>{console.log("route handler from 4");
    res.send("response 4");
}
); 

app.listen(3000,()=>{
    console.log("Listen to port 3000");
});


