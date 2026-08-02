const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    }
    const decodeobj = await jwt.verify(token, process.env.tokenPW);

    // validate the token

    const { _id } = decodeobj;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
};

module.exports = { userAuth };
