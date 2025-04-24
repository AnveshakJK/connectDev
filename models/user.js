const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String
    },
    password:{
        type:String
    },
    age:{
        type:String
    },
    gender:{
       type:String
    }
});

// create a model - like class which create it instance.

const User = mongoose.model("User",userSchema);

module.exports = User; 