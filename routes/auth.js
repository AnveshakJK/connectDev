const express = require("express");

const authRouter = express.Router();
const bycrypt = require("bcrypt");
const { validateSignupDate } = require("../utils/validate");
const User = require("../models/user"); // require models for add data to db in document
const jwt = require("jsonwebtoken");
require("dotenv").config();

authRouter.post("/signup", async (req, res) => {
  try {
    //validate the data
    validateSignupDate(req);

    const { firstName, lastName, emailId, password } = req.body;

    // encrypt the data
    const passwordhased = await bycrypt.hash(
      password,
      process.env.hashPwLength,
    );
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordhased,
    });

    if (user?.skills.length > 10)
      throw new Error("skills cannot be more than 10");

    const saveUser = await user.save();

    const token = await saveUser.getJwt();

    res.cookie("token", token, { expires: new Date(Date.now() + 4 * 60000) });

    res.json({ message: "user added successfully", data: saveUser });
  } catch (err) {
    res.status(400).send("Not save the user:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Email id not valid.");
    }

    //***  password for also used schema method
    const ispassword = await user.ValidatePassword(password);

    if (ispassword) {
      const token = await user.getJwt();

      // console.log(token);

      res.cookie("token", token, { expires: new Date(Date.now() + 4 * 60000) });

      // res.send(user);
      res.send("User Connected");
    } else {
      throw new Error("password not correct");
    }
  } catch (err) {
    res.status(400).send("Err " + err.message);
  }
});

//logout api call
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout successfully!");
});

module.exports = authRouter;
