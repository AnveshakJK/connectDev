const express = require("express");

const connectDB = require("./config/database");

const app = express();

const cookieParser = require("cookie-parser");

app.use(express.json()); 

app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");


app.use("/",authRouter); //request coming to slash , go to and check all routes for inside this whichever is matching then by request handler handle this.
 
app.use("/",profileRouter);
app.use("/",requestRouter);  // express go one by one if it not find in upper routerhandler, middlewares.


// connection for db
connectDB()
    .then(()=>{
        console.log("Database connected successfully");
        app.listen(3000,()=>{
            console.log("Listen to port 3000");
        });
    })
    .catch((err)=>{
        console.log("Database cannot be connected");
    });

// app.listen(3000,()=>{
//     console.log("Listen to port 3000");
// });


