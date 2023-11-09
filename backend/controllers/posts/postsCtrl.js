const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/Post");
const seedrandom = require("seedrandom");
const validateMongoDbUserId = require("../../utils/validateMongoDbUserId");
const fs = require("fs");
const handleCloudinaryUpload = require("../../config/cloundinary/cloudinaryUploadConfig");
const User = require("../../model/user/User");
const checkProfanity = require("../../utils/profanWords");
const decodeToken = require("../../utils/DecodeLoginUser");
const mongoose = require("mongoose");
const path = require("path");
const filterCriteria = require("../../utils/filterSortCriteria");

// '''''''''''''''''''''''''''''''''''''''''
//   Create Post conttoller
// '''''''''''''''''''''''''''''''''''''''''''''
const createPostCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.user;
	validateMongoDbUserId(id);

	const user = await User.findById(id);

	const enteredDetails =
		req?.body?.title +
		"" +
		req?.body?.description +
		"" +
		req?.body?.content;

	if (checkProfanity(enteredDetails)) {
		user.isBlocked = true;
		await user.save();
		throw new Error(
			"post creation failed, account has been block for using profane words"
		);
	}
	try {
		const imageLocalPath = `public/images/posts/${req?.file?.fileName}`;
		uploadedImage = await handleCloudinaryUpload(
			imageLocalPath,
			`mern-blog-app/${user?.email}/postImage`
		);

		// remove the file
		if (fs.existsSync(imageLocalPath)) {
			fs.unlink(imageLocalPath);
		} else {
			throw new Error("No valid file path found for deletions");
		}

		const post = await Post.create({
			...req.body,
			user: id,
			image: uploadedImage?.url,
		});

		res.json(post);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
const fetchAllUserPostCtrl = expressAsyncHandler(async (req, res) => {
	console.log("im here all usersss");

	const { filter } = req.query;
	const page = parseInt(req.query.page) || 1; // Current page number, default to 1
	const postNumberPerPage = parseInt(req.query.postNumberPerPage) || 10; // Number of items per page
	console.log(filter, page, postNumberPerPage);
	const sortingObject = filterCriteria(filter);

	try {
		const Posts = await Post.find({});
		const posts = await Post.find({})
			.populate({ path: "user", select: ["firstName", "lastName"] })
			.sort(sortingObject)
			.skip((page - 1) * postNumberPerPage)
			.limit(postNumberPerPage)
			.select(["-content", "-description", "-title", "-image"]);

		const totalPosts = Posts.length;
		const totalPages = Math.ceil(totalPosts / postNumberPerPage);

		res.json({
			currentPage: page,
			totalPages: totalPages,
			posts: posts,
			totalNumber: totalPosts,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
// '''''''''''''''''''''''''''''''''''''''''
//   fetch All the  user post controller
// '''''''''''''''''''''''''''''''''''''''''''''
const fetchUserPostCtrl = expressAsyncHandler(async (req, res) => {
	const { userId } = req.body;
	const { filter } = req.query;
	const page = parseInt(req.query.page) || 1; // Current page number, default to 1
	const postNumberPerPage = parseInt(req.query.postNumberPerPage) || 10; // Number of items per page

	const sortingObject = filterCriteria(filter);

	try {
		const { Posts } = await User.findById(userId)
			.populate({
				path: "Posts",
				select: "_id",
			})
			.select("Posts");

		const user = await User.findById(userId)
			.populate({
				path: "Posts",
				select: "-content",
				options: { sort: sortingObject },
				skip: (page - 1) * postNumberPerPage,
				limit: postNumberPerPage,
			})
			.select("Posts");
		const userPosts = user.Posts;

		const totalPosts = Posts.length;
		const totalPages = Math.ceil(totalPosts / postNumberPerPage);
		res.json({
			currentPage: page,
			totalPages: totalPages,
			posts: userPosts,
			totalNumber: totalPosts,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   fetch single post controller
// '''''''''''''''''''''''''''''''''''''''''''''
const fetchSinglePostsCtrl = expressAsyncHandler(async (req, res) => {
	const userToken = req?.body?.userToken;

	const { id } = req.params;
	validateMongoDbUserId(id);
	try {
		const post = await Post.findById(id).populate("user");
		// updating number of views of post
		post.numViews++;
		await post.save();

		if (userToken) {
			const loginUser = await decodeToken(userToken);
			await User.findByIdAndUpdate(
				loginUser._id,
				{
					$push: { postViewHistory: post._id },
				},
				{ new: true }
			);
		}
		res.json(post);
	} catch (error) {
		res.json(error);
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   update post controller
// '''''''''''''''''''''''''''''''''''''''''''''
const updatePostCtrl = expressAsyncHandler(async (req, res) => {
	const postId = req?.params?.id;
	const loginUserId = req?.user?._id;
	validateMongoDbUserId(postId);
	validateMongoDbUserId(loginUserId);

	try {
		let user = await User.findById(loginUserId);
		let post = await Post.findById(postId);

		if (user?._id.toString() !== post?.user?._id.toString())
			throw new Error("only User who created post can Edit it");
		const enteredDetails =
			req?.body?.title +
			"" +
			req?.body?.description +
			"" +
			req?.body?.content;

		if (checkProfanity(enteredDetails)) {
			user.isBlocked = true;
			await user.save();
			throw new Error(
				"post updpate failed, account has been block for using profane words"
			);
		}
		const imageLocalPath = `public/images/posts/${req?.file?.fileName}`;

		if (req?.file) {
			uploadedImage = await handleCloudinaryUpload(
				imageLocalPath,
				`mern-blog-app/${user?.email}/postImage`
			);
		}
		let imageUrl;
		req?.file ? (imageUrl = uploadedImage?.url) : (imageUrl = post.image);
		// remove the file
		if (fs.existsSync(imageLocalPath)) {
			fs.unlink(imageLocalPath);
		} else {
			throw new Error("No valid file path found for deletions");
		}

		post = await Post.findByIdAndUpdate(
			postId,
			{
				...req.body,
				image: imageUrl,
			},
			{
				new: true,
			}
		).populate("user");
		res.json(post);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   delete post controller
// ''''''''''''''''''''''''''''''''''''''''''''

const deletePostCtrl = expressAsyncHandler(async (req, res) => {
	const { postIds } = req.body;

	try {
		const deletedPosts = await Post.deleteMany({
			_id: { $in: postIds },
		});

		res.status(200).json({
			message: `successfully deleted ${deletedPosts.deletedCount} posts`,
			postIds,
		});
	} catch (error) {
		res.status(400).json({ message: "failed to delete post" });
	}
});
// '''''''''''''''''''''''''''''''''''''''''
//   liking a post controller
// ''''''''''''''''''''''''''''''''''''''''''''

const likePostCtrl = expressAsyncHandler(async (req, res) => {
	const { postId } = req?.body;

	const loginUserId = req?.user?.id;
	try {
		const post = await Post.findById(postId);
		const alreadyDisliked = post.disLikes.includes(loginUserId);
		if (alreadyDisliked) {
			const newPost = await Post.findByIdAndUpdate(
				postId,
				{
					$pull: { disLikes: loginUserId },
					$push: { likes: loginUserId },
				},
				{ new: true }
			);
			res.json({ likes: newPost.likes, disLikes: newPost.disLikes });
			return;
		}
		const alreadyLiked = post.likes.includes(loginUserId);
		if (alreadyLiked) {
			const newPost = await Post.findByIdAndUpdate(
				postId,
				{
					$pull: { likes: loginUserId },
				},
				{ new: true }
			);
			res.json({ likes: newPost.likes, disLikes: newPost.disLikes });
			return;
		} else {
			const newPost = await Post.findByIdAndUpdate(
				postId,
				{
					$push: { likes: loginUserId },
				},
				{ new: true }
			);
			res.json({ likes: newPost.likes, disLikes: newPost.disLikes });
			return;
		}
	} catch (error) {
		res.json(error);
	}
});
// '''''''''''''''''''''''''''''''''''''''''
//   Disliking a post controller
// ''''''''''''''''''''''''''''''''''''''''''''

const disLikingPostCtrl = expressAsyncHandler(async (req, res) => {
	const { postId } = req?.body;
	const loginUserId = req?.user?.id;
	try {
		const post = await Post.findById(postId);
		const alreadyLiked = post.likes.includes(loginUserId);
		if (alreadyLiked) {
			newPost = await Post.findByIdAndUpdate(
				postId,
				{
					$pull: { likes: loginUserId },
					$push: { disLikes: loginUserId },
				},
				{ new: true }
			);
			res.json({ likes: newPost.likes, disLikes: newPost.disLikes });
			return;
		}
		const alreadyDisliked = post.disLikes.includes(loginUserId);
		if (alreadyDisliked) {
			const newPost = await Post.findByIdAndUpdate(
				postId,
				{
					$pull: { disLikes: loginUserId },
				},
				{ new: true }
			);
			res.json({ likes: newPost.likes, disLikes: newPost.disLikes });
			return;
		} else {
			const newPost = await Post.findByIdAndUpdate(
				postId,
				{
					$push: { disLikes: loginUserId },
				},
				{ new: true }
			);
			res.json({ likes: newPost.likes, disLikes: newPost.disLikes });
			return;
		}
	} catch (error) {
		res.json(error);
	}
});

const searchPostCtrl = expressAsyncHandler(async (req, res) => {
	const page = parseInt(req?.query?.page) || 1; // Current page,
	const searchQuery = req?.query?.searchQuery;
	const postNumberPerPage = parseInt(req?.query?.postNumberPerPage) || 10; // Number of items per page

	// Calculate the skip value to skip items on previous pages
	const skip = (page - 1) * postNumberPerPage;
	try {
		// Use MongoDB's find method with skip and limit

		const posts = await Post.find({ $text: { $search: searchQuery } })
			.skip(skip)
			.limit(postNumberPerPage)
			.populate("user"); // Use the query parameter

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

const fetchPostByCategoryCtrl = expressAsyncHandler(async (req, res) => {
	let page = parseInt(req?.query?.page) || 1; // Current page,ipco
	const postNumberPerPage = parseInt(req?.query?.postNumberPerPage) || 10; // Number of items per page
	const category = req.query?.category;
	const searchQuery = req.query?.searchQuery;
	// Calculate the skip value to skip items on previous pages
	let skip = (page - 1) * postNumberPerPage;
	let filter;
	if (category === "all" && searchQuery.length === 0) filter = {};
	if (category === "all" && searchQuery.length !== 0)
		filter = {
			$and: [{ $text: { $search: searchQuery } }],
		};
	if (category !== "all" && searchQuery.length === 0)
		filter = { category: category };
	if (category !== "all" && searchQuery.length !== 0)
		filter = {
			category: category,
			$and: [{ $text: { $search: searchQuery } }],
		};
	console.log(filter, searchQuery);
	try {
		const posts = await Post.find(filter)
			.skip(skip)
			.limit(postNumberPerPage)
			.populate({
				path: "user",
				select: ["_id", "firstName", "lastName", "profilePhoto"],
			})
			.select("-content");
		res.status(200).json(posts);
		return;
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

const fetchUserPostHistoryCtrl = expressAsyncHandler(async (req, res) => {
	const { _id } = req.user;

	const page = parseInt(req.query.page) || 1; // Current page number, default to 1
	const postNumberPerPage = parseInt(req.query.postNumberPerPage) || 10; // Number of items per page

	try {
		const { postViewHistory } = await User.findById(_id)
			.populate({
				path: "postViewHistory",
				select: ["image", "title", "createdAt"],
			})
			.select("postViewHistory");

		const totalPages = Math.ceil(
			postViewHistory.length / postNumberPerPage
		);
		const startIndex = (page - 1) * postNumberPerPage;
		const endIndex = page * postNumberPerPage;

		const paginatedPosts = postViewHistory
			.reverse()
			.slice(startIndex, endIndex);

		res.json({
			currentPage: page,
			totalPages: totalPages,
			posts: paginatedPosts,
		});
	} catch (error) {
		res.status(500).json({ message: "failed to fetch post history" });
	}
});

const fetchUserSavedPostCtrl = expressAsyncHandler(async (req, res) => {
	const { _id } = req.user;

	const page = parseInt(req.query.page) || 1; // Current page number, default to 1
	const postNumberPerPage = parseInt(req.query.postNumberPerPage) || 10; // Number of items per page

	try {
		const { savedPost } = await User.findById(_id)
			.populate({
				path: "savedPost",
				select: ["image", "title", "createdAt"],
			})
			.sort({ _id: -1 })
			.select("savedPost");

		const totalPages = Math.ceil(savedPost.length / postNumberPerPage);
		const startIndex = (page - 1) * postNumberPerPage;
		const endIndex = page * postNumberPerPage;

		const paginatedPosts = savedPost.reverse().slice(startIndex, endIndex);
		res.json({
			currentPage: page,
			totalPages: totalPages,
			posts: paginatedPosts,
		});
	} catch (error) {
		res.status(500).json({ message: "failed to fetch post history" });
	}
});

module.exports = {
	createPostCtrl,
	fetchUserPostCtrl,
	fetchSinglePostsCtrl,
	updatePostCtrl,
	deletePostCtrl,
	likePostCtrl,
	disLikingPostCtrl,
	searchPostCtrl,
	fetchPostByCategoryCtrl,
	fetchUserPostHistoryCtrl,
	fetchUserSavedPostCtrl,
	fetchAllUserPostCtrl,
};
