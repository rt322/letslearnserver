import  express  from "express";
import { addlectures, createCourse, deleteCourse, deletelecture, getAllCourses, getcourselectures } from "../controllers/courseController.js";
import singleupload from "../middlewares/multer.js";
import { authorizeAdmin, isAuthenticated ,authorizeSubscribers} from "../middlewares/auth.js";


const router=express.Router();

router.route("/courses").get(getAllCourses)
router.route("/createcourse").post(isAuthenticated,authorizeAdmin,singleupload, createCourse)
router.route("/course/:id").get(isAuthenticated,authorizeSubscribers,getcourselectures).post(isAuthenticated,singleupload, addlectures).delete(isAuthenticated,authorizeAdmin,deleteCourse)

router.route("/deletelecture").delete(isAuthenticated,authorizeAdmin,deletelecture)

export default router;