import  express  from "express";
import { contact, getDashboardStats } from "../controllers/otherControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";



const router=express.Router();

router.route("/contact").post(contact)
router.route("/admin/stats").get(isAuthenticated,getDashboardStats)

export default router;