import app from "./app.js";
import {config} from "dotenv"
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary"
import RazorPay from "razorpay"
import nodeCron from "node-cron"
import { Stats } from "./models/Stats.js";

config({
    path:"./config/config.env"
})
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
    api_key:process.env.CLOUDINARY_CLIENT_API,
    api_secret:process.env.CLOUDINARY_CLIENT_SECRET,
})



connectDB();
export const instance = new RazorPay({
    key_id : process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });
//every star staring from 0th index is for sec,min,hr,day,month,yr
//nd this particular code is for 1st date of every month
nodeCron.schedule("0 0 0 1 * *", async () => {
    try {
        await Stats.create({});
       
    } catch (error) {
        console.error("Error creating stats:", error);
    }
});

   
  

app.listen(process.env.PORT,()=>{
    console.log(`server is working on port:${process.env.PORT}`)
})

