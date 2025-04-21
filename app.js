const express = require("express");
const app = express();

// app.use((req,res)=>{
//     res.send("Hello from server");
// });  // The first app.use() is catch-all middleware (no path specified), which means it matches all incoming requests, regardless of the URL.

app.use("/test",(req,res)=>{
    res.send("Hello from server test");
});

app.use("/hello",(req,res)=>{
    res.send("Hello from server hello");
});

app.listen(3000,()=>{
    console.log("server is running.");
});