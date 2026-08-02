const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/mid");
const connectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photourl about gender age";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photourl",
        "about",
        "age",
        "gender",
      ]); // through array way populate.
    res.json({ mesage: "Data fetched successfully", data: connectionRequests });
  } catch (err) {
    req.statusCode(400).send("Err " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequestModel
      .find({
        $or: [
          {
            toUserId: loggedInUser._id,
            status: "accepted",
          },
          {
            fromUserId: loggedInUser._id,
            status: "accepted",
          },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    // res.json({message:"Connection fetch successful" , data});
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    // res.json({message:"Connection fetch successful" , connectionRequests});
    res.json({ message: "Connection fetch successful", data });
  } catch (err) {
    res.status(400).send({ message: err.mesage });
  }
});

// userRouter.get("/feed?page=1&limit=10",userAuth,async(req,res)=>{
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connectionRequests = await connectionRequestModel
      .find({
        $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
      })
      .select("fromUserId toUserId");
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    console.log(hideUsersFromFeed);
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//

module.exports = userRouter;
