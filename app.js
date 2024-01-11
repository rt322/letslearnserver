import express  from "express";
import cookieParser from "cookie-parser";


const app=express();
//using middleware
app.use(express.json());
app.use(
    express.urlencoded({
        extended:true,
    })
)
app.use(cookieParser())
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

app.use(ErrorMiddleware)
export default app;

