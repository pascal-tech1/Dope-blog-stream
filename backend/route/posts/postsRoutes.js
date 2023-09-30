const express = require("express");
const {
	createPostCtrl,
	fetchAllPostsCtrl,
	fetchSinglePostsCtrl,
	updatePostCtrl,
	deletePostCtrl,
	likePostCtrl,
	disLikingPostCtrl,
	searchPostCtrl,
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

postsRoutes.put(
	"/update/:id",
	authMiddleWare,
	postImageUpload.single("image"),
	postImageResize,
	updatePostCtrl
);
postsRoutes.get("/search", searchPostCtrl);
postsRoutes.put("/like", authMiddleWare, likePostCtrl);
postsRoutes.put("/dislike", authMiddleWare, disLikingPostCtrl);
postsRoutes.get("/", fetchAllPostsCtrl);
postsRoutes.get("/:id", fetchSinglePostsCtrl);

postsRoutes.delete("/:id", authMiddleWare, deletePostCtrl);

module.exports = postsRoutes;
