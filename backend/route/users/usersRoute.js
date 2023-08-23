const express = require("express");
const authMiddleWare = require("../../middlewares/authentication/authMiddleWare");

const {
  userRegisterCtrl,
  userLoginCtrl,
  fetchAllUserCtrl,
  deleteUserCtrl,
  fetchUserDetailsCtrl,
  updateUserDetailsCtrl,
  updatePasswordCtrl,
  followingUserCtrl,
  unFollowingUserCtrl,
  sendAcctVerificationEmailCtrl,
  AcctVerificationCtrl,
  sendPasswordResetEmailCtrl,
  resetPasswordCtrl,
  profilePhotoUploadCtrl,
} = require("../../controllers/users/usersCtrl");
const {
  profilePhotoUpload,
  ProfilePhotResize,
} = require("../../middlewares/uploads/PhotoUpload");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", userLoginCtrl);
userRoutes.get("/", authMiddleWare, fetchAllUserCtrl);
userRoutes.delete("/delete/:USERID", deleteUserCtrl);
userRoutes.get("/:USERID", fetchUserDetailsCtrl);
userRoutes.post(
  "/profile-picture-upload",
  authMiddleWare,
  profilePhotoUpload.single("image"),
  ProfilePhotResize,
  profilePhotoUploadCtrl
);
userRoutes.post("/send-email", authMiddleWare, sendAcctVerificationEmailCtrl);
userRoutes.post("/verify-Account", authMiddleWare, AcctVerificationCtrl);
userRoutes.post("/forget-password", sendPasswordResetEmailCtrl);
userRoutes.put("/reset-password", resetPasswordCtrl);
userRoutes.post("/follow", authMiddleWare, followingUserCtrl);
userRoutes.post("/unfollow", authMiddleWare, unFollowingUserCtrl);
userRoutes.put("/updatePassword", authMiddleWare, updatePasswordCtrl);
userRoutes.put("/:USERID", authMiddleWare, updateUserDetailsCtrl);
userRoutes.get("/profile/:USERID", authMiddleWare, fetchUserDetailsCtrl);

module.exports = userRoutes;
