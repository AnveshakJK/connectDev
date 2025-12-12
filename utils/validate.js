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


//validator for profile edit 

const validateEditProfileData = (req)=>{
    const allowedEditFields = ["firstName","lastName","photourl","gender","age","about","skills"];
   

   /* 
    this do because of 
    Error: Mongoose cannot update a field to undefined, triggering a validation crash.
Cause: Frontend sent "skills": undefined, and backend blindly updated user fields.
Fix 1: Removing the skills input prevented sending undefined.
Fix 2 (better): Auto-cleaning undefined/null fields deleted invalid data before updating, preventing Mongoose errors and keeping database updates safe.
   */

    // Auto-clean undefined fields in backend
    for (let key in req.body) {
  if (req.body[key] === undefined || req.body[key] === null) {
    delete req.body[key];
  }
}
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditAllowed;
}

module.exports = {validateSignupDate,validateEditProfileData};