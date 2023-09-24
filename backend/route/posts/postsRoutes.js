const express = require("express");
const {
	createPostCtrl,
	fetchAllPostsCtrl,
	fetchSinglePostsCtrl,
	updatePostCtrl,
	deletePostCtrl,
	likePostCtrl,
	disLikingPostCtrl,
} = require("../../controllers/posts/postsCtrl");
const authMiddleWare = require("../../middlewares/authentication/authMiddleWare");
const {
	postImageResize,
	postImageUpload,
} = require("../../middlewares/uploads/PhotoUpload");

const postsRoutes = express.Router();

postsRoutes.post(
	"/",
	authMiddleWare,
	postImageUpload.single("image"),
	postImageResize,
	createPostCtrl
);
postsRoutes.put("/like", authMiddleWare, likePostCtrl);
postsRoutes.put("/dislike", authMiddleWare, disLikingPostCtrl);
postsRoutes.get("/", fetchAllPostsCtrl);
postsRoutes.get("/:id", fetchSinglePostsCtrl);
postsRoutes.put("/:id", authMiddleWare, updatePostCtrl);
postsRoutes.delete("/:id", authMiddleWare, deletePostCtrl);

module.exports = postsRoutes;
