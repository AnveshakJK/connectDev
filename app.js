const express = require("express");
const app = express();

app.get("/user",(req,res)=>{
    res.send({firstname:"hello",lastname:"JK"});
});

app.post("/user",(req,res)=>{
    res.send("data saved");
});

app.put("/user",(req,res)=>{
    res.send("this put happen");
});

app.delete("/user",(req,res)=>{
    res.send("Deletion of data done");
});

app.use("/user",(req,res)=>{
    res.send("method of used use for all http method.");
});

app.listen(3000,()=>{
    console.log("Listen to port 3000");
});


