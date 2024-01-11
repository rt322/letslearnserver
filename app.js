import express  from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app=express();
//using middleware
app.use(express.json());
app.use(
    express.urlencoded({
        extended:true,
    })
)
app.use(cookieParser())
//cors is used to connect backend website with frontend
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],
}))
//importing and using routes
import  User  from "./routes/userRoutes.js";
import course from "./routes/courseRoutes.js"
import ErrorMiddleware from "./middlewares/Error.js";
import payment from "./routes/paymentRoutes.js"
import other from "./routes/otherRoutes.js"

app.use("/api/v1",course)
app.use("/api/v1",User)
app.use("/api/v1",payment)
app.use("/api/v1",other)

app.get("/",(req,res)=>res.send(`<h1>server is working! Click <a href=${process.env.FRONTEND_URL}=>here</a>to visit frontend</h1>`))

app.use(ErrorMiddleware)
export default app;



