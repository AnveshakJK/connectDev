const mongoose = require("mongoose");
const validator = require("validator");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validator(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validator(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "not a strong password,minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1: " +
            value,
          );
        }
      },
    },
    age: {
      type: String,
      min: 4,
      max: 50,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photourl: {
      type: String,
      default:
        "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-male-icon.png",
      validator(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid image url: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of user.",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;  // Automatically strips the password field from the JSON output
        return ret;
      }
    }
  },
);

userSchema.index({ firstName: 1, lsatName: 1 }); // compound indexes be done here

userSchema.index({ gender: 1 });

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Jayank@123$", {
    expiresIn: "1d",
  });
  return token;
};

//for password
userSchema.methods.ValidatePassword = async function (passwordInputuser) {
  const user = this;
  const passwordhash = user.password;
  const ispasswordValid = await bcrypt.compare(passwordInputuser, passwordhash);
  return ispasswordValid;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
