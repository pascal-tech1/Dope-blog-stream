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
	confirmSentEmailCtrl,
	sendPasswordResetEmailCtrl,
	resetPasswordCtrl,
	profilePhotoUploadCtrl,
	userLoginWithTokenCtrl,
	savePostCtrl,
	fetchRandomUserCtrl,
	fetchUserFollowersListCtrl,
	fetchUserFollowingListCtrl,
	fetchUserCountsCtrl,
	fetchWhoViewedUserProfileCtrl,
	fetchPostImpressionsCount,
	blockOrUnblockUserCtrl,
} = require("../../controllers/users/usersCtrl");
const {
	profilePhotoUpload,
	ProfilePhotResize,
} = require("../../middlewares/uploads/PhotoUpload");

const userRoutes = express.Router();

userRoutes.get("/user-details-Count", authMiddleWare, fetchUserCountsCtrl);
userRoutes.get("/admin-all-users", authMiddleWare, fetchAllUserCtrl);
userRoutes.get("/viewedBy", authMiddleWare, fetchWhoViewedUserProfileCtrl);
userRoutes.get("/following", fetchUserFollowingListCtrl);
userRoutes.get("/followers", fetchUserFollowersListCtrl);
userRoutes.post(
	"/blockOrUnblock-user",
	authMiddleWare,
	blockOrUnblockUserCtrl
);
userRoutes.get(
	"/impression-Counts",
	authMiddleWare,
	fetchPostImpressionsCount
);
userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/random-users", fetchRandomUserCtrl);
userRoutes.get("/loginWithToken", authMiddleWare, userLoginWithTokenCtrl);
userRoutes.post("/login", userLoginCtrl);

userRoutes.post("/delete", authMiddleWare, deleteUserCtrl);
// userRoutes.get("/:USERID", authMiddleWare, fetchUserDetailsCtrl);
userRoutes.get("/profile/:userId", authMiddleWare, fetchUserDetailsCtrl);
userRoutes.post("/save-post", authMiddleWare, savePostCtrl);
userRoutes.post(
	"/profile-picture-upload",
	authMiddleWare,
	profilePhotoUpload.single("image"),
	ProfilePhotResize,
	profilePhotoUploadCtrl
);
userRoutes.post("/send-email", sendAcctVerificationEmailCtrl);
userRoutes.post("/confirm-sent-email", confirmSentEmailCtrl);
userRoutes.post("/forget-password", sendPasswordResetEmailCtrl);
userRoutes.updatePasswordCtrl("/reset-password", resetPasswordCtrl);
userRoutes.post("/follow", authMiddleWare, followingUserCtrl);
userRoutes.post("/unfollow", authMiddleWare, unFollowingUserCtrl);
userRoutes.put("/updatePassword", authMiddleWare, updatePasswordCtrl);
userRoutes.put("/:USERID", authMiddleWare, updateUserDetailsCtrl);

module.exports = userRoutes;
