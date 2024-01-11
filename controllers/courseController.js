import {Course} from "../models/Course.js"
import { getDataUri } from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary"
import { Stats } from "../models/Stats.js";

export const getAllCourses=async(req,res,next)=>{
   const courses= await Course.find().select("-lectures");
   res.status(200).json({
    success:true,
    courses,
   })
}

export const createCourse = async (req, res, next) => {
   
     const { title, description, category, createdBy } = req.body;
     if (!title || !description || !category || !createdBy) 
       return next(new ErrorHandler("Please add all fields", 400));
     
 
     
      const file = req.file;
   const fileuri=   getDataUri(file);
   const mycloud=await cloudinary.v2.uploader.upload(fileuri.content);
 
     await Course.create({
       title,
       description,
       category,
       createdBy,
       poster: {
         public_id: mycloud.public_id,
         url: mycloud.secure_url,
       },
     });
 
     res.status(201).json({
       success: true,
       message: 'Course created. Add lectures now.',
     });
   }
   
   export const getcourselectures=async(req,res,next)=>{
    const course= await Course.findById(req.params.id);//params is used when we want something from place where we give route

    if(!course) 
    return next(new ErrorHandler("Course not found",404));
  course.views+=1;
  await course.save();

    res.status(200).json({
     success:true,
     lectures:course.lectures
    })
 }
//max videosixe=100mb
 export const addlectures=async(req,res,next)=>{
  const {title,description}=req.body;
  const course= await Course.findById(req.params.id);//params is used when we want something from place where we give route

  //const file=req.file

  if(!course) 
  return next(new ErrorHandler("Course not found",404));
//upload file here

const file = req.file;
const fileuri=   getDataUri(file);
const mycloud=await cloudinary.v2.uploader.upload(fileuri.content,{resource_type:"video"});


course.lectures.push({
  title,description,video:{
    public_id:mycloud.public_id,
    url:mycloud.secure_url
  }
})
course.numOfVideos=course.lectures.length;
await course.save();

  res.status(200).json({
   success:true,
  message:"lecture added in course"
  })
}

export const deleteCourse = async (req, res, next) => {
   
   const course= await Course.findById(req.params.id);
   if(!course) 
   return next(new ErrorHandler("Course not found",404));

   await cloudinary.v2.uploader.destroy(course.poster.public_id);
    for(let i=0;i<course.lectures.length;i++) {
      const singleLecture=course.lectures[i];
      await cloudinary.v2.uploader.destroy(singleLecture.video.public_id,{resource_type:'video'});
    }
    await course.deleteOne();
 
   res.status(200).json({
    success:true,
   message:"course deleted"
   })
};


export const deletelecture = async (req, res, next) => {
   const {courseId,lectureId}=req.query;
  const course= await Course.findById(courseId);
  if(!course) 
  return next(new ErrorHandler("Course not found",404));

  const lecture = course.lectures.find((item) => item._id.toString() === lectureId.toString());

      if (!lecture) {
         return next(new ErrorHandler("Lecture not found", 404));
      }

      await cloudinary.v2.uploader.destroy(lecture.video.public_id, { resource_type: 'video' });


  course.lectures=course.lectures.filter((item)=>{
    if(item._id.toString()!== lectureId.toString()) return item;
  })

  course.numOfVideos=course.lectures.length;
   await course.save();

  res.status(200).json({
   success:true,
  message:"Lecture deleted"
  })
};

Course.watch().on("change",async()=>{
  const stats=await Stats.find({}).sort({createdOn:"desc"}).limit(1)//for last stat created
  const courses=await Course.find({});
  let totalviews=0;

  for (let index = 0; index < courses.length; index++) {
   totalviews+=courses[index].views;
  }
  stats[0].views=totalviews;
  stats[0].createdOn=new Date(Date.now());
  await stats[0].save();
})