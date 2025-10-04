const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

const register = async(req,res,next) => {
    try{
        const{name,email,password,role} = req.body; 

        if(!name || !email || !password) return res.status(400).json({message:"Missing fields"});
        
        const exists = await User.findOne({email});
        if (exists) return res.status(400).json({message:"Email already registered"});
        
        const salt = await bcrypt.genSalt(10);
        const passwordHash= await bcrypt.hash(password,salt);
        
        const user = await User.create({name,email,passwordHash,role});
        
        const token =jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"12h"});
        res.status(201).json({token,user:{id:user._id,name:user.name,email:user.email,role:user.role}}); // Pass back role for confirmation
    }catch (err) {next(err);}
};

const login = async(req,res,next) =>{
    try{
        const {email,password}=req.body;
        if(!email||!password)return res.status(400).json({message:"Missing fields"});
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid Credentials"});
        
        const isMatch = await bcrypt.compare(password, user.passwordHash); // Ensure password check is here!
        if (!isMatch) return res.status(400).json({message:"Invalid Credentials"});

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"12h"});
        res.json({token,user:{id:user._id,name:user.name,email:user.email,role:user.role}}); // Pass back role for confirmation
    } catch(err){next(err);}
};
module.exports= {register,login};
