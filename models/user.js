const mongoose = require('mongoose');
const validator = require('validator');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema =new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,  
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,  // this not run properly see it again , while in patch work but in post not as it run by restarting it - Error saving the user:E11000 duplicate key error collection: connectDev.users index: emailId_1 dup key: { emailId:"jayank@gmail.com" } ,but some time without new keyword it also run but and also new i didn't add while making schema.new Schema object using Mongoose’s Schema constructor. This schema defines:The structure of documents in a MongoDB collection (fields, types, etc.).Validation rules (required, minLength, etc.).Default values, custom validators.Indexes like unique.
        lowercase:true,
        trim:true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email address: "+value);
            }
        }
    },
    password:{
        type:String,
        required:true,
        validator(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("not a strong password,minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1: "+value);
            }
        }
    },
    age:{
        type:String,
        min:4,
        max:50,
    },
    gender:{ // by default work for new document form not already formed for this runvalidate:true then it happen to do in app.js findbyidandupdate() method in happen there in patch. as here updation done.
       type:String,
       validate(value){
        if(!["male","female","others"].includes(value)){
            throw new Error("Gender data is not valid");
        }
       }
    },
    photourl:{
        type:String,
        default:"https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-male-icon.png",
        validator(value){
            if(!validator.isURL(value)){
                throw new Error("invalid image url: "+value);
            }
        }
    },
    about:{
        type:String,
        default:"This is a default about of user.",
    },
    skills:{
        type:[String],
    }
},{timestamps:true});

// create a model - like class which create it instance.

// const User = mongoose.model("User",userSchema); 

// schema method 

// User.find({firstName:"Akshay",lastName:"Saini"});
userSchema.index({firstName:1,lsatName:1});  // compound indexes be done here

userSchema.index({gender:1});

//for jwt
// there normal function use not arrow function due to "this";
userSchema.methods.getJwt = async function (){
    const user = this;
  const token = await jwt.sign({_id:user._id},"Jayank@123$",{expiresIn:"1d"});
  return token;
};

//for password
userSchema.methods.ValidatePassword = async function(passwordInputuser){
    const user = this;
    const passwordhash = user.password;
    console.log(passwordhash);
    const ispasswordValid = await bcrypt.compare(passwordInputuser,passwordhash);
    return ispasswordValid;
}
const User = mongoose.model("User",userSchema); 
module.exports = User; 