import { Router } from "express";
import { changeCurrentPassword, login, logout, refreshAccessToken, register, updateProfile, toggleSaveJob, getSaveJobs } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { singleUpload } from "../middleware/multer.js";

const router = Router();

router.route("/register").post(singleUpload, register)

router.route("/login").post(login)

router.route("/profile/update").post(verifyJWT, singleUpload, updateProfile)

router.route("/logout").post(logout)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/saved-jobs").get(verifyJWT, getSaveJobs);
router.route("/saved-jobs/:jobId").post(verifyJWT, toggleSaveJob);

export default router;
