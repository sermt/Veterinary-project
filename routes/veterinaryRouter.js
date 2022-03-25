import express from "express";
import {
  authentication,
  checkToken,
  confirm,
  forgetPassword,
  newPassword,
  profile,
  register,
  updatePassword,
  updateProfile,
} from "../controllers/veterinaryController.js";
import checkAuth from "../middleware/checkAuth.js";
const router = express.Router();

//public
router.post("/login", authentication);
router.get("/confirm/:token", confirm);
router.post("/forget-password", forgetPassword);
router.post("/", register);
router.route("/forget-password/:token").get(checkToken).post(newPassword);
//private
router.get("/profile", checkAuth, profile);
router.put("/profile/:id", checkAuth, updateProfile);
router.put("/update-password", checkAuth, updatePassword);
export default router;