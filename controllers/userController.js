import ErrorHandler from "../utils/errorHandler.js";
import {User} from "../models/User.js"
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import {Course}  from "../models/Course.js"
import cloudinary from "cloudinary"
import { Stats } from "../models/Stats.js";

export const register=async(req,res,next)=>{
const{name,email,password}=req.body;



if (!name || !email || !password) {
    const error = new ErrorHandler("Please enter all fields", 400);
   
    return next(error);
}
let user=await User.findOne({email});
if(user) return next(new ErrorHandler("user already exits",409));


//upload file on cloudinary
user=await User.create({
    name,email,password,
  
})
sendToken(res,user,"registered successfully",201)
};


export const login=async(req,res,next)=>{
    const{email,password}=req.body;
    //const file=req.file;
    
    if ( !email || !password) {
        const error = new ErrorHandler("Please enter all fields", 400);
       
        return next(error);
    }
    const user=await User.findOne({email}).select("+password");
    if(!user) return next(new ErrorHandler("Incorrect email or password",401));
    
    const isMatch=await user.comparePassword(password);

    if(!isMatch) return next(new ErrorHandler("Incorrect email or password", 401))
    
    sendToken(res,user,`Welcome back ${user.name} `,200)
    };


    export const logout=async(req,res,next)=>{
        res
        .status(200)
        .cookie("token",null,{
            expires:new Date(Date.now()),
        })
        .json({
            success:true,
            message:"logged out",
        })
    }

    export const getMyProfile=async(req,res,next)=>{
    const user=await User.findById(req.user._id);
     
        res.status(200).json({
            success:true,
           user
        })
    }


    export const changepassword=async(req,res,next)=>{
        
        const{oldpassword,newpassword}=req.body; 
        
        if ( !oldpassword || !newpassword) {
            const error = new ErrorHandler("Please enter all fields", 400);
           
            return next(error);
        }

        const user=await User.findById(req.user._id).select("+password");
        const isMatch=await user.comparePassword(oldpassword);

        if ( !isMatch) {
            const error = new ErrorHandler("Incorrect old password", 400);
           
            return next(error);
        }

        user.password=newpassword;
        await user.save();
            res.status(200).json({
                success:true,
               message:"password changed"
            })
        }

        export const updateprofile=async(req,res,next)=>{
          const {name,email}=req.body;

          const user=await User.findById(req.user._id);

          if(name) user.name=name;
          if(email) user.email=email;
            await user.save();
                res.status(200).json({
                    success:true,
                   message:"profile updated"
                })
            }

            export const forgetpassword=async(req,res,next)=>{
                const {email}=req.body;
                const user=await User.findOne({email});
               
              if(!user) return next(new ErrorHandler("user not found",400));
              const resetToken=await user.getresetToken();

              await user.save();

              const url=`${process.env.FRONTEND_URL}/resetpassword/${resetToken}`

              const message=`Click on link to reset your password,${url}.if you have not requested then please ignore`
              //send token via email
            
            await  sendEmail(user.email,"Let's Learn Reset Password",message)
                    res.status(200).json({
                        success:true,
                       message:`reset token has been sent to ${user.email}`
                    })
                }

                export const resetpassword=async(req,res,next)=>{
                  const {token}=req.params;

                  const resetPasswordToken=crypto.createHash("sha256").update(token).digest("hex");

                  const user=await User.findOne({
                    resetPasswordToken,resetPasswordExpire:{
                        $gt:Date.now(),
                    }
                  });

                  if(!user)
 return next(new ErrorHandler("token is invalid or has been expired"))  

 user.password=req.body.password;
user.resetPasswordExpire=undefined;
user.resetPasswordToken=undefined;
await user.save();

                        res.status(200).json({
                            success:true,
                           message:"password changed successfully",
                           
                        })
                    }


  export const addtoPlaylist=async(req,res,next)=>{
     const user=await User.findById(req.user._id);
     const course=await Course.findById(req.body.id)
      if(!course) return next(new ErrorHandler("invalid course id",404))

        const itemExist=user.playlist.find((item)=> {
            if(item.course.toString()=== course._id.toString()) return true;
        })

        if(itemExist) {
        return next(new ErrorHandler("item already exists",409))
       
        }

        user.playlist.push({
            course:course._id,
            poster:course.poster._url,
        })

        await user.save();

       res.status(200).json({
              success:true,              message:"added to playlist"
             })
               } 

               export const removefromPlaylist=async(req,res,next)=>{
                const user=await User.findById(req.user._id);
const course=await Course.findById(req.query.id)

if(!course) return next(new ErrorHandler("invalid course id",404))

const newplaylist=user.playlist.filter((item)=>{
if(item.course.toString()!== course._id.toString()) 
return item;
})

user.playlist=newplaylist;

await user.save();

res.status(200).json({
 success:true,                       message:"removed from playlist"
  })
     }        
                                     
        
           
                  
               
               //Admin controllers
      export const getallusers=async(req,res,next)=>{
            const users=await User.find({})          
    
           res.status(200).json({
             success:true,                       users
              })
                 }   
                 
                 export const updaterole=async(req,res,next)=>{
                    const user=await User.findById(req.params.id)          
            
if(!user) 
return next(new ErrorHandler("user not found",404))

if(user.role==="user") user.role="admin"
else user.role="user";
await user.save();

                   res.status(200).json({
                     success:true,                message:"role updated" 
                      })
                         }                
                                                 
                         export const deleteuser=async(req,res,next)=>{
                            const user=await User.findById(req.params.id)          
                    
        if(!user) 
        return next(new ErrorHandler("user not found",404))
        
       //cancel subscription
        await user.deleteOne();
        
                           res.status(200).json({
                             success:true,                message:"user deleted" 
                              })
                                 }
                                 
                                 export const deletemyprofile=async(req,res,next)=>{
                                    const user=await User.findById(req.user._id)          
                            
               
                
               //cancel subscription
                await user.deleteOne();
                
                                   res.status(200).cookie("token",null,{
                                    expires:new Date(Date.now()),
                                   }).json({
                                     success:true,                message:"user deleted" 
                                      })
                                         }               
               //on any change in user collection following function is executed                                   
             User.watch().on("change",async()=>{
const stats=await Stats.find({}).sort({createdOn:"desc"}).limit(1)//for last stat created

const subscription=await User.find({"subscription.status":"active"});
stats[0].users=await User.countDocuments();
stats[0].subscription=subscription.length;
stats[0].createdOn=new Date(Date.now());
await stats[0].save();
             })                                             