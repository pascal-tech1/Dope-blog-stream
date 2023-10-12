const express = require("express");
const {
	createPostCtrl,

	fetchSinglePostsCtrl,
	updatePostCtrl,
	deletePostCtrl,
	likePostCtrl,
	disLikingPostCtrl,
	searchPostCtrl,
	fetchUserPostCtrl,

	fetchPostByCategoryCtrl,
} = require("../../controllers/posts/postsCtrl");
const authMiddleWare = require("../../middlewares/authentication/authMiddleWare");
const {
	postImageResize,
	postImageUpload,
} = require("../../middlewares/uploads/PhotoUpload");

const postsRoutes = express.Router();
postsRoutes.get("/", fetchPostByCategoryCtrl);
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
postsRoutes.put("/user-post", fetchUserPostCtrl);
postsRoutes.put("/like", authMiddleWare, likePostCtrl);
postsRoutes.put("/dislike", authMiddleWare, disLikingPostCtrl);

postsRoutes.put("/:id", fetchSinglePostsCtrl);

postsRoutes.delete("/:id", authMiddleWare, deletePostCtrl);

module.exports = postsRoutes;
