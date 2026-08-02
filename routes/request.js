const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/mid");
const connectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invalid status type: " + status });
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "user not found" });
      }
      const existingConnectionRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "connection request Already Exist!!" });
      }
      const newconnectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await newconnectionRequest.save();
      res.json({
        message: req.user.firstName + "is" + status + "in" + toUser.firstName,
        data,
      });
    } catch (err) {
      // req.status(400).send("Error:"+err.message);
      res.send("Err " + err.message);
    }
    // res.send(user.firstName+"send a connection request");
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "status not allowed!" });
      }

      //requestId check
      const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "connection request not found!" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "connection request" + status, data });
    } catch (err) {
      res.status(400).send("Err " + err.message);
    }
  },
);

module.exports = requestRouter;
