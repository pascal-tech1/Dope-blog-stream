const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/Post");
const seedrandom = require("seedrandom");
const validateMongoDbUserId = require("../../utils/validateMongoDbUserId");
const fs = require("fs");
const handleCloudinaryUpload = require("../../config/cloundinary/cloudinaryUploadConfig");
const User = require("../../model/user/User");
const checkProfanity = require("../../utils/profanWords");
const decodeToken = require("../../utils/DecodeLoginUser");

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
		// if (fs.existsSync(imageLocalPath)) {
		// 	fs.unlink(imageLocalPath);
		// } else {
		// 	throw new Error("No valid file path found for deletions");
		// }

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

// '''''''''''''''''''''''''''''''''''''''''
//   fetch all post and populate with the user that created it Post conttoller
// '''''''''''''''''''''''''''''''''''''''''''''

const fetchAllPostsCtrl = expressAsyncHandler(async (req, res) => {
	let page = parseInt(req?.query?.page) || 1; // Current page,ipco
	// const seed = req?.query?.seed;
	const postNumberPerPage = parseInt(req?.query?.postNumberPerPage) || 10; // Number of items per page

	// Calculate the skip value to skip items on previous pages
	let skip = (page - 1) * postNumberPerPage;
	try {
		// Use MongoDB's find method with skip and limit

		const posts = await Post.find({})
			.skip(skip)
			.limit(postNumberPerPage)
			.populate({
				path: "user",
				select: ["_id", "firstName", "lastName", "profilePhoto"], // Exclude the "password" field
			})
			.select("-content"); // Use the query
	
		console.log(posts);
		console.log("skip", skip);
		res.status(200).json(posts);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   fetch single post controller
// '''''''''''''''''''''''''''''''''''''''''''''

const fetchUserPostCtrl = expressAsyncHandler(async (req, res) => {
	const { userId, postId } = req.body;

	const postNumberPerPage = parseInt(req?.query?.postNumberPerPage) || 10; // Number of items per page

	try {
		const user = await User.findById(userId).populate({
			path: "Posts",
			select: "-content",
		});

		const posts = await user.get("Posts");

		const randomPosts = posts
			.filter((post) => post._id !== postId)
			.sort(() => Math.random() - 0.5)
			.slice(0, postNumberPerPage);
		console.log(randomPosts);
		res.json(randomPosts);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
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
	const { id } = req?.params;
	try {
		const post = await Post.findByIdAndDelete(id);
		res.json(post);
	} catch (error) {
		res.json(error);
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

module.exports = {
	createPostCtrl,
	fetchAllPostsCtrl,
	fetchUserPostCtrl,
	fetchSinglePostsCtrl,
	updatePostCtrl,
	deletePostCtrl,
	likePostCtrl,
	disLikingPostCtrl,
	searchPostCtrl,
};
