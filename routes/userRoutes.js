import express from "express";
import { addtoPlaylist, changepassword, deletemyprofile, deleteuser, forgetpassword, getMyProfile, getallusers, login, logout, register, removefromPlaylist, resetpassword, updateprofile, updaterole } from "../controllers/userController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";


const router=express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated,getMyProfile);
router.route("/me").delete(isAuthenticated,deletemyprofile);
router.route("/changepassword").put(isAuthenticated,changepassword);
router.route("/updateprofile").put(isAuthenticated,updateprofile);
router.route("/forgetpassword").post(forgetpassword);
router.route("/resetpassword/:token").put(resetpassword);
router.route("/addtoplaylist").post(isAuthenticated,addtoPlaylist);
router.route("/removefromplaylist").delete(isAuthenticated,removefromPlaylist);

//Admin routes
router.route("/admin/users").get(isAuthenticated,authorizeAdmin,getallusers);

router.route("/user/:id").put(isAuthenticated,updaterole);

router.route("/admin/user/:id").delete(isAuthenticated,authorizeAdmin,deleteuser);



export default router;
