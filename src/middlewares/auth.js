const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = async(req,res,next)=>{
    const header = req.headers.authorization;
    
    if(!header || !header.startsWith("Bearer")) return res.status(401).json({message:"No token"});
    
    const token = header.split(" ")[1]; 
    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(payload.userId).select("-passwordHash");
        if(!user) return res.status(401).json({message:"Invalid Token"});
        req.user=user;
        next();

    }catch(err) {
        return res.status(401).json({message:"Token Error",error:err.message});
    }
};
const adminOnly = (req,res,next) => {
    if(!req.user || req.user.role !=="admin") return res.status(403).json({message:"Admin Only"});
    next();
};
module.exports = {auth,adminOnly};
