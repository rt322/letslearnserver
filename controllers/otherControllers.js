import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Stats } from "../models/Stats.js";


export const contact=async(req,res,next)=>{
    const{name,email,message}=req.body;
    if(!name || !email || !message) 
    return next(new ErrorHandler("All fields are necessary,so kindly enter them"),404)
    const to=process.env.MY_MAIL;
    const subject="Contact from Let's Learn team";
    const text=`I am ${name} and my email is ${email},\n${message}`;
    await sendEmail(to,subject,text);
   res.status(200).json({
    success:true,
    message:"Your message has been sent."
   }) 
}

export const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await Stats.find({}).sort({ createdOn: "desc" }).limit(12);
        const statsdata = [];

        const requiredsize = 12 - stats.length;
        
        for (let index = 0; index < stats.length; index++) {
            statsdata.unshift(stats[index]); // unshift is for adding not in stack order rather reverse order
        }

        for (let index = 0; index < requiredsize; index++) {
            statsdata.unshift({
                users: 0,
                subscription: 0,
                views: 0
            });
        }

        const userscount = statsdata[11].users ;
        const subscriptioncount = statsdata[11].subscription ;
        const viewscount = statsdata[11].views ;

        let userspercent = true,
            viewspercent = true,
            subscriptionpercent = true;

        let usersprofit = true,
            viewsprofit = true,
            subscriptionprofit = true;

        if (statsdata[10]?.users === 0) userspercent = userscount * 100;
        if (statsdata[10]?.views === 0) viewspercent = viewscount * 100;
        if (statsdata[10]?.subscription === 0) subscriptionpercent = subscriptioncount * 100;
        else {
            const difference = {
                users: statsdata[11].users - statsdata[10].users,
                views: statsdata[11].views - statsdata[10].views,
                subscription: statsdata[11].subscription - statsdata[10].subscription,
            };

            userspercent = (difference.users / statsdata[10].users) * 100;
            viewspercent = (difference.views / statsdata[10].views) * 100;
            subscriptionpercent = (difference.subscription / statsdata[10].subscription) * 100;

            if (userspercent < 0) usersprofit = false;
            if (viewspercent < 0) viewsprofit = false;
            if (subscriptionpercent < 0) subscriptionprofit = false;
        }

        res.status(200).json({
            success: true,
            stats: statsdata,
            userscount,
            subscriptioncount,
            viewscount,
            subscriptionpercent,
            viewspercent,
            userspercent,
            subscriptionprofit,
            viewsprofit,
            usersprofit,
        });
    } catch (error) {
        next(error);
    }
};
