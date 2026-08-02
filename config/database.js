require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.mongodb_url);
};

module.exports = connectDB;
