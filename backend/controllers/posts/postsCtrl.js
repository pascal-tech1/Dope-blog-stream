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
const { filterCriteria } = require("../../utils/filterSortCriteria");
const PostViewedHistory = require("../../model/postHistory/PostViewedHistory");
const { isValidObjectId } = require("mongoose");
const cheerio = require("cheerio");

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
		fs.unlink(imageLocalPath, (err) => {
			if (err) {
				res.status(500).json({ message: "failed to edit post" });
				return;
			} else {
				console.log("File deleted successfully");
			}
		});

		const post = await Post.create({
			...req.body,
			user: id,
			image: uploadedImage?.url,
			blurImageUrl: req.blurImageUrl,
		});

		res.json(post);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
const fetchAllUserPostCtrl = expressAsyncHandler(async (req, res) => {
	const { filter, searchTerm } = req.query;

	const page = parseInt(req.query.page) || 1; // Current page number, default to 1
	const postNumberPerPage = parseInt(req.query.postNumberPerPage) || 10; // Number of items per page
	const regexPattern = new RegExp(`.*${searchTerm}.*`, "i");
	const sortingObject = filterCriteria(filter);
	let searchQuery;

	if (searchTerm) {
		if (isValidObjectId(searchTerm)) {
			searchQuery = { _id: new mongoose.Types.ObjectId(searchTerm) };
		} else {
			searchQuery = { category: { $regex: regexPattern } };
		}
	} else {
		searchQuery = {};
	}

	try {
		const Posts = await Post.find(searchQuery);
		const posts = await Post.find(searchQuery)
			.populate({ path: "user", select: ["firstName", "lastName"] })
			.sort(sortingObject)
			.skip((page - 1) * postNumberPerPage)
			.limit(postNumberPerPage)
			.select([
				"-content",
				"-description",
				"-title",
				"-image",
				"-blurImageUrl",
				"-password",
			]);

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
	const { filter, searchTerm } = req.query;

	const page = parseInt(req.query.page) || 1; // Current page number, default to 1
	const postNumberPerPage = parseInt(req.query.postNumberPerPage) || 10; // Number of items per page
	const regexPattern = new RegExp(`.*${searchTerm}.*`, "i");
	const sortingObject = filterCriteria(filter);
	let searchQuery;

	if (searchTerm) {
		searchQuery = {
			$or: [
				{ title: { $regex: regexPattern } },
				{ category: { $regex: regexPattern } },
			],
		};
	} else {
		searchQuery = {};
	}

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
				match: searchQuery,
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
			const loginUserId = await decodeToken(userToken);
			const thresholdTime = new Date();
			thresholdTime.setHours(thresholdTime.getHours() - 24);

			// Check if userViewedPost exists and updatedAt is within the last 24 hours

			userViewedPost = await PostViewedHistory.findOneAndUpdate(
				{
					post: post._id,
					user: loginUserId,
					updatedAt: { $gte: thresholdTime },
				},
				{ $set: { updatedAt: new Date() } },
				{ upsert: true, new: true }
			).populate({
				path: "post",
				select: ["image", "title", "createdAt", "blurImageUrl"],
			});
		}
		res.json({ post, userViewedPost });
	} catch (error) {
		console.log(error);
		res.json({ message: "fetching post failed try again" });
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   update post controller
// '''''''''''''''''''''''''''''''''''''''''''''
const updatePostCtrl = expressAsyncHandler(async (req, res) => {
	try {
		// const $ = cheerio.load(req.body.content);

		const postId = req?.params?.id;
		const loginUserId = req?.user?._id;
		validateMongoDbUserId(loginUserId);
		validateMongoDbUserId(postId);
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
		req?.file &&
			fs.unlink(imageLocalPath, (err) => {
				if (err) {
					res.status(500).json({ message: "failed to edit post" });
					return;
				} else {
					console.log("File deleted successfully");
				}
			});

		post = await Post.findByIdAndUpdate(
			postId,
			{
				...req.body,
				image: imageUrl,
				blurImageUrl: req.blurImageUrl,
			},
			{
				new: true,
			}
		).populate("user");
		res.json(post);
	} catch (error) {
		console.log(error);
		res.status(500).json({ messsage: error.message });
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
	const where = req.query?.where;

	const sort = where === "morePost" && { category: -1 };

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

	try {
		const posts = await Post.find(filter)
			.skip(skip)
			.limit(postNumberPerPage)
			.sort(sort)
			.populate({
				path: "user",
				select: [
					"_id",
					"firstName",
					"lastName",
					"profilePhoto",
					"blurProfilePhoto",
				],
			})
			.select("-content");

		// const newPostPromises = posts.map(async (post) => {
		// 	const imageUrl = post.image;
		// 	const imageUrlBlur = await uptimizeCloudinaryImage(imageUrl, 200);
		// 	const userProfilePhotoWithBlur = await uptimizeCloudinaryImage(
		// 		imageUrl,
		// 		50
		// 	);

		// 	// Update the image property correctly

		// 	return {
		// 		...post._doc,

		// 		image: imageUrlBlur,
		// 		user: {
		// 			...post._doc.user._doc,
		// 			profilePhoto: userProfilePhotoWithBlur,
		// 		},
		// 	};
		// });
		// Wait for all promises to be resolved
		// const newPost = await Promise.all(newPostPromises);

		res.status(200).json(posts);
		return;
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

const fetchUserPostHistoryCtrl = expressAsyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { searchTerm } = req.query;
	const page = parseInt(req.query.page) || 1;
	const numberPerPage = parseInt(req.query.postNumberPerPage) || 10;
	const regexPattern = new RegExp(`.*${searchTerm}.*`, "i");

	let searchQuery = {};
	if (searchTerm) {
		searchQuery = { title: { $regex: regexPattern } };
	}

	try {
		const user = await User.findById(_id).populate({
			path: "postViewHistory",
			populate: {
				path: "post",
				select: ["image", "title", "createdAt", "blurImageUrl"],
			},

			options: { sort: { updatedAt: -1 } },
		});

		// Filter the post history array based on the search criteria

		const filteredpostViewHistory = user.postViewHistory.filter(
			(postViewHistory) => {
				return (
					postViewHistory.post &&
					postViewHistory.post.title.match(regexPattern)
				);
			}
		);
		
		const postViewHistoryTotalCount = filteredpostViewHistory.length;

		const paginatedpostViewHistory = filteredpostViewHistory.slice(
			(page - 1) * numberPerPage,
			page * numberPerPage
		);
	
		res.json({
			totalPostHistory: postViewHistoryTotalCount,
			posts: paginatedpostViewHistory,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
});

const fetchUserSavedPostCtrl = expressAsyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { searchTerm } = req.query;
	const page = parseInt(req.query.page) || 1;
	const numberPerPage = parseInt(req.query.postNumberPerPage) || 10;
	const regexPattern = new RegExp(`.*${searchTerm}.*`, "i");

	let searchQuery = {};
	if (searchTerm) {
		searchQuery = { title: { $regex: regexPattern } };
	}

	try {
		const user = await User.findById(_id).populate({
			path: "savedPost",
			populate: {
				path: "post",
				select: ["image", "title", "createdAt", "blurImageUrl"],
			},

			options: { sort: { updatedAt: -1 } },
		});

		// Filter the savedPost array based on the search criteria
		const filteredSavedPost = user.savedPost.filter((savedPost) => {
			return savedPost.post && savedPost.post.title.match(regexPattern);
		});

		const savedPosTotalCount = filteredSavedPost.length;

		const paginatedSavedPost = filteredSavedPost.slice(
			(page - 1) * numberPerPage,
			page * numberPerPage
		);

		res.json({
			totalSavedPosts: savedPosTotalCount,
			posts: paginatedSavedPost,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
});

const postImageCtrl = expressAsyncHandler(async (req, res) => {
	const user = req.user;
	const imageLocalPath = `public/images/posts/${req?.file?.fileName}`;
	uploadedImage = await handleCloudinaryUpload(
		imageLocalPath,
		`mern-blog-app/${user?.email}/postImage`
	);
	// remove the file
	fs.unlink(imageLocalPath, (err) => {
		if (err) {
			res.status(500).json({ message: "failed to edit post" });
			return;
		} else {
			console.log("File deleted successfully");
		}
	});
	res.status(200).json(uploadedImage);
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
	postImageCtrl,
};
