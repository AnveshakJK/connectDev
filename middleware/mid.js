const adminAuth = (req,res,next)=>{
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
     res.status(400).send("admin unauthorized request");
    }else{
     next();
    }
 };


 const userAuth = (req,res,next)=>{
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
     res.status(400).send(" user unauthorized request");
    }else{
     next();
    }
 };

 module.exports() = {adminAuth,userAuth};