const mongoose = require('mongoose');

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
    },
    password:{
        type:String,
        required:true
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
        default:"https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-male-icon.png"
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

const User = mongoose.model("User",userSchema);

module.exports = User; 