const validator = require('validator');

const validateSignupDate = (req)=>{

    const{firstName , lastName , emailId , password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name not valid");
    } 
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password");
    }
};

module.exports = {validateSignupDate};