import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";



export const isAuthenticated=async(req,res,next)=>{
    const {token}=req.cookies;

    if(!token)
    return next(new ErrorHandler("Not logged in",401))

    const decoded=jwt.verify(token,process.env.JWT_SECRET);
  //finding user
    req.user=await User.findById(decoded._id);
    next();//going to next middleware
}

export const authorizeAdmin=async(req,res,next)=>{
 if(req.user.role!=='admin')
 return next(new ErrorHandler(`${req.user.role} is not allowed to access this resource`),403);
next();
}

export const authorizeSubscribers=async(req,res,next)=>{
  if(req.user.subscription.status!=='active' && req.user.role!=="admin")
  return next(new ErrorHandler("Only subscribers can access this resource"),403);
 next();
 }