import mongoose from "mongoose"

const schema=mongoose.Schema({
    title :{
        type:String,
         required:[true,"enter course title"],
          minlength:[4,"title must be of atleast 4characters"],
           maxlength:[80,"title can't exceed 80 characters"]
    },

description:{type:String,
     required:[true,"enter course description"],
     minlength:[20,"title must be of atleast 20 characters"],
    
    }, 

lectures :[
    {
        title :{
            type:String,
            required:true,
        },
    description:{
        type: String,
        required:true,
    },
     video:{
      public_id:{
        type:String,
        required:true
      },
      
      url:{
        type:String,
        required:true
      }
    }
},
],
poster:{
    public_id:{
      type:String,
      required:true
    },
    
    url:{
      type:String,
      required:true
    }
  },


views:{
    type:Number, 
    default:0,
} ,

numOfVideos:{
    type:Number, 
    default:0
} ,

category:{
    type:String,
     required:true
} ,

createdBy:{
    type:String,
     required:[true,"enter creator name"]
} ,

createdOn:{
    type:Date,
     default:Date.now,
} 


})

export const Course=mongoose.model("Course",schema);