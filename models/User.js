import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"
 
const schema=new mongoose.Schema({
    name :{
        type:String,
        required:[true,"enter your name"]
    },

email :{
type:String,
 required:[true,"enter your email"],
  unique:true,
   validate:validator.isEmail,
},

password:{ 
    type:String,
     required:[true,"enter your password"],
      minlength:[6,"password must be of atleast 6 characters"],
       select:false
    },

    subscription:{
        id:String,
        status:String
    },


role:{
    type:String ,
     enum:["admin","user"],
    default:"user",
} ,


playlist:[
    {
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
     poster:String,
}],


createdAt:{
    type:Date,
     default:Date.now
} ,

resetPasswordToken :String,

resetPasswordExpire:String,
});

schema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
  const hashedPassword=  await bcrypt.hash(this.password,10)//10 are rounds,more rounds good is password security
  this.password=hashedPassword;
  next();
})
//for token generation below function is written
schema.methods.getJWTToken=function(){
  //here id of current user will be converted to token
    return jwt.sign({_id:this._id},process.env.JWT_SECRET,{ expiresIn:"15d"}) }

    schema.methods.comparePassword=async function(password){
     
       return await bcrypt.compare(password,this.password);
   
}

schema.methods.getresetToken=function(){
const resetToken=crypto.randomBytes(20).toString("hex");
//for creating hashed token in hexadecimal
this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");

this.resetPasswordExpire=Date.now()+15*60*1000;//for 15 mins

return resetToken;
}

export const User=mongoose.model("User",schema);

