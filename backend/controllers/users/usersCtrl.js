const User = require("../../model/user/User");
const fs = require("fs");
const path = require("path");
const generateJwtToken = require("../../config/token/generateJwtToken");
const validateMongoDbUserId = require("../../utils/validateMongoDbUserId");
const expressAsyncHandler = require("express-async-handler");
const mailTransporter = require("../../config/sendEmail/sendEmailConfig");
const crypto = require("crypto");

const email = require("../../config/email");
const handleCloudinaryUpload = require("../../config/cloundinary/cloudinaryUploadConfig");
const UserProfileView = require("../../model/userProfileView/userProfileView");
const { default: mongoose, isValidObjectId } = require("mongoose");
const { filterUserCriteria } = require("../../utils/filterSortCriteria");
const Post = require("../../model/post/Post");
const emailVerificationHtml = require("./sendEmailVerificationLink");
const emailChangeVerificationHtml = require("./sendChangeEmailLink");
const SavedPosts = require("../../model/savedPosts/savedPosts");

// '''''''''''''''''''''''''''''''''''''''''
//         Register user
// '''''''''''''''''''''''''''''''''''''''''''''

const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	// finding if user exist in mongoDb database using the mongodb findOne method
	const userExist = await User.findOne({ email });
	if (userExist)
		throw new Error("User already Exist, try different email");

	try {
		const user = await User.create({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password,
		});
		res.status(201).json({
			status: "success",
			message: "account created successfully",
			userEmail: user.email,
		});
	} catch (error) {
		res
			.status(500)
			.json({ status: "failed", message: "account creation failed" });
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//         login user
// '''''''''''''''''''''''''''''''''''''''''''''

const userLoginCtrl = expressAsyncHandler(async (req, res) => {
	// finding if user exist in mongoDb database using the mongodb findOne method
	try {
		const userFound = await User.findOne({
			email: req?.body?.email,
		}).select([
			"_id",
			"firstName",
			"lastName",
			"profilePhoto",
			"blurProfilePhoto",
			"email",
			"profession",
			"location",
			"language",
			"education",
			"isBlocked",
			"isAdmin",
			"password",
			"bio",
			"following",
			"createdAt",
			"nickName",
			"coverPhoto",
		]);

		if (
			userFound &&
			(await userFound.isPasswordCorrect(req?.body?.password))
		) {
			res.status(200).json({
				status: "success",
				user: userFound,
				// generate a token that will be used to retain the login of the user
				token: generateJwtToken(userFound?._id),
				message: "login successfully",
			});
		} else throw new Error("login failed, invalid credentials");
	} catch (error) {
		console.log(error);
		res.status(400).json({
			status: "failed",
			message: error.message,
		});
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//         login user with token
// '''''''''''''''''''''''''''''''''''''''''''''

const userLoginWithTokenCtrl = expressAsyncHandler(async (req, res) => {
	const userFound = await User.findById(req.user._id).select([
		"_id",
		"firstName",
		"lastName",
		"profilePhoto",
		"blurProfilePhoto",
		"email",
		"profession",
		"location",
		"language",
		"education",
		"isBlocked",
		"isAdmin",
		"bio",
		"following",
		"createdAt",
		"nickName",
		"coverPhoto",
	]);
	res.status(200).json({
		status: "success",
		user: userFound,
	});
});

// '''''''''''''''''''''''''''''''''''''''''''''

// '''''''''''''''''''''''''''''''''''''''''
//        fetch single user details
// '''''''''''''''''''''''''''''''''''''''''''''
const fetchUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
	const { userId } = req.params;
	const loginUserId = req.user._id;
	validateMongoDbUserId(userId);

	try {
		const foundUser = await User.aggregate([
			{ $match: { _id: new mongoose.Types.ObjectId(userId) } },
			{
				$addFields: {
					followersCount: { $size: "$followers" },
					followingCount: { $size: "$following" },
				},
			},

			{
				$project: {
					_id: 1,
					firstName: 1,
					lastName: 1,
					profilePhoto: 1,
					blurProfilePhoto: 1,
					email: 1,
					profession: 1,
					location: 1,
					language: 1,
					education: 1,
					blurCoverPhoto: 1,
					bio: 1,
					createdAt: 1,
					nickName: 1,
					coverPhoto: 1,
					followersCount: "$followersCount",
					followingCount: "$followingCount",
					postsCount: "$postsCount",
				},
			},
		]);

		if (loginUserId.toString() !== userId.toString()) {
			let allreadyViewed = await UserProfileView.findOne({
				viewedUser: {
					$elemMatch: { $eq: new mongoose.Types.ObjectId(userId) },
				},
				$and: [{ viewedBy: { $elemMatch: { $eq: loginUserId } } }],
			});

			if (allreadyViewed === null) {
				await UserProfileView.create({
					viewedUser: userId,
					viewedBy: loginUserId,
				});
			} else {
				await UserProfileView.findByIdAndUpdate(
					allreadyViewed._id,
					{
						$inc: { numberOfView: 1 },
					},
					{ new: true }
				);
			}
		}

		res.status(200).json({ foundUser: foundUser[0] });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//        update user profile
// '''''''''''''''''''''''''''''''''''''''''''''
const updateUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
	const { _id } = req?.user;
	validateMongoDbUserId(_id);

	try {
		const updatedUser = await User.findByIdAndUpdate(
			_id,
			{
				...req?.body,
			},
			{
				new: true,
				runValidators: true,
			}
		).select([
			"_id",
			"firstName",
			"lastName",
			"profilePhoto",
			"blurProfilePhoto",
			"email",
			"profession",
			"location",
			"language",
			"education",
			"isBlocked",
			"isAdmin",
			"bio",
			"coverPhoto",
		]);

		res.status(201).json({
			status: "success",
			message: "profile updated successfully",
			user: updatedUser,
		});
	} catch (error) {
		res.status(500).json({
			status: "failed",
			message: "profile updated failed try again",
		});
	}
});
// '''''''''''''''''''''''''''''''''''''''''
//        update password field
// '''''''''''''''''''''''''''''''''''''''''''''

// '''''''''''''''''''''''''''''''''''''''''
//        following a user controller
// '''''''''''''''''''''''''''''''''''''''''''''
const followingUserCtrl = expressAsyncHandler(async (req, res) => {
	const loginUserId = req?.user.id;

	const userToFollowId = req?.body.userToFollowOrUnfollowId;
	if (userToFollowId === loginUserId)
		throw new Error("sorry you can't follow yourself");
	validateMongoDbUserId(userToFollowId);

	let userToFollow = await User.findById(userToFollowId);

	const allreadyFollowing = await userToFollow?.followers?.find(
		(user) => user?.toString() === loginUserId.toString()
	);
	if (allreadyFollowing) {
		throw new Error("You are already following this user");
	}
	userToFollow = await User.findByIdAndUpdate(
		userToFollowId,
		{
			$push: { followers: loginUserId },
		},
		{
			new: true,
			runValidators: true,
		}
	).select([
		"_id",
		"firstName",
		"lastName",
		"profilePhoto",
		"blurProfilePhoto",
	]);

	const user = await User.findByIdAndUpdate(
		loginUserId,
		{
			$push: { following: userToFollowId },
		},
		{
			new: true,
			runValidators: true,
		}
	);

	res.json({
		message: `you have successfully follow ${userToFollow?.firstName} ${userToFollow?.lastName}`,
		user,
		userToFollow,
	});
});
// '''''''''''''''''''''''''''''''''''''''''
//        unfollowing a user controller
// '''''''''''''''''''''''''''''''''''''''''''''
const unFollowingUserCtrl = expressAsyncHandler(async (req, res) => {
	const loginUserId = req?.user.id;
	const userToUnFollowId = req?.body?.userToFollowOrUnfollowId;
	validateMongoDbUserId(userToUnFollowId);
	const userToUnFollow = await User.findByIdAndUpdate(
		userToUnFollowId,
		{
			$pull: { followers: loginUserId },
		},
		{
			new: true,
			runValidators: true,
		}
	);
	const user = await User.findByIdAndUpdate(
		loginUserId,
		{
			$pull: { following: userToUnFollowId },
		},
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(200).json({
		message: `you have successfully unfollow ${userToUnFollow?.firstName} ${userToUnFollow?.lastName}`,
		user,
		userToUnFollowId,
	});
});

// '''''''''''''''''''''''''''''''''''''''''
//        sending the user email verification link to verify acount
// '''''''''''''''''''''''''''''''''''''''''''''

const sendAcctVerificationEmailCtrl = expressAsyncHandler(
	async (req, res) => {
		try {
			const { email } = req.body;
			if (!email) throw Error("email is required");
			const foundUser = await User.findOne({ email: email });

			const verificationToken =
				await foundUser.accountVerificationHandler();
			await foundUser.save();

			const emailToSend = emailVerificationHtml(
				foundUser,
				verificationToken
			);
			let mailDetails = {
				from: "pascalazubike003@gmail.com",
				to: `${foundUser.email}`,
				subject: "Account activation token",
				html: emailToSend,
			};

			mailTransporter.sendMail(mailDetails, function (err, data) {
				if (err) {
					throw new Error(err);
				} else {
					res.json({ message: "email sent successfully", mailDetails });
					return;
				}
			});
		} catch (error) {
			console.log(error);
			res.status(400).json({
				status: "failed",
				message: error.message,
			});
		}
	}
);
const confirmSentEmailCtrl = expressAsyncHandler(async (req, res) => {
	const { token } = req?.body;

	try {
		const acctVerificationToken = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");

		const foundUser = await User.findOne({
			accountVerificationToken: acctVerificationToken,
			accountVerificationTokenExpires: { $gt: new Date() },
		});

		if (!foundUser) throw new Error("Token expired, try again");
		if (foundUser.isAccountVerified === true) {
			foundUser.accountVerificationToken = undefined;
			foundUser.accountVerificationTokenExpires = undefined;
			res.json({ message: "your Account is Already verified" });
			return;
		}

		foundUser.isAccountVerified = true;
		foundUser.accountVerificationToken = undefined;
		foundUser.accountVerificationTokenExpires = undefined;
		await foundUser.save();

		let mailDetails = {
			from: "pascalazubike003@gmail.com",
			to: `${foundUser.email}`,
			subject: "Mern-blog-app Email verification",
			html: `
    <h1>Email Verification</h1>
    <p>your email successfully verified!`,
		};

		mailTransporter.sendMail(mailDetails, function (err, data) {
			if (err) {
				throw new Error(
					"Sending verification email failed please try again"
				);
				return;
			} else {
				res.json({
					message: "your email address has been successfully verified. ",
				});
				return;
			}
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ status: "failed", message: error.message });
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//        sending the user the password reset link to their email
// '''''''''''''''''''''''''''''''''''''''''''''

const sendPasswordResetEmailCtrl = expressAsyncHandler(
	async (req, res) => {
		const { email } = req?.body;

		const foundUser = await User.findOne({ email: email });
		if (!foundUser) throw new Error("User not found");

		try {
			const resetToken = await foundUser.passwordResetHandler();
			await foundUser.save(); // this save the user info altered in passwordResetHandler in the user model

			let mailDetails = {
				from: "pascalazubike003@gmail.com",
				to: `${foundUser.email}`,
				subject: "Mern-blog-app forgotten Password",
				html: `
                      <h1>Password Reset</h1>
                       <p>You have requested to reset your password. Please click the link below to reset your password:</p>
                       <a href="http://localhost:5173/reset-password/${resetToken}">Reset Password</a>
                       <p>If you didn't initiate this password reset, please contact the MERN Blog App admin immediately.</p>
                         `,
			};

			mailTransporter.sendMail(mailDetails, function (err, data) {
				if (err) throw new Error("failed to send email try again ");
				res.send({
					status: "success",
					message:
						"check your inbox password reset email sent successfully",
				});
			});
		} catch (error) {
			res.status(400).json({
				status: "failed",
				message: error.message,
			});
		}
	}
);

// '''''''''''''''''''''''''''''''''''''''''
//       reset the user password after they have successfully click the mail send
// '''''''''''''''''''''''''''''''''''''''''''''

const resetPasswordCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const { newPassword } = req?.body;
		const { token } = req?.body;
		const hashedPasswordToken = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");

		const foundUser = await User.findOne({
			passwordRessetToken: hashedPasswordToken,
			passwordResetExpires: { $gt: new Date() }, //check if the token is not expired
		});
		if (!foundUser) throw new Error("Token Expired");

		foundUser.passwordChangeAt = Date.now();

		foundUser.password = newPassword;
		await foundUser.save();
		let mailDetails = {
			from: "pascalazubike003@gmail.com",
			to: `${foundUser.email}`,
			subject: "Mern-blog-app Email verification",
			html: `
    <h1>Mern Blog App Password Reset</h1>
    <p>your password have been reset successfully!`,
		};

		mailTransporter.sendMail(mailDetails, function (err, data) {
			if (err) res.json(err);
			res.json(mailDetails);
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

const updatePasswordCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const { newPassword } = req?.body;
		const { oldPassword } = req?.body;

		const foundUser = await User.findById(req.user._id);
		if (!foundUser) throw new Error("invalid login credentials");
		const isPasswordMatch = await foundUser.isPasswordCorrect(oldPassword);
		if (!isPasswordMatch) throw new Error("invalid password");

		foundUser.passwordChangeAt = Date.now();
		foundUser.password = newPassword;
		await foundUser.save();

		let mailDetails = {
			from: "pascalazubike003@gmail.com",
			to: `${foundUser.email}`,
			subject: "Mern-blog-app Email verification",
			html: `
    <h1>Mern Blog App Password Reset</h1>
    <p>your password have been reset successfully!`,
		};

		mailTransporter.sendMail(mailDetails, function (err, data) {
			if (err) res.json(err);
			res.json({
				status: "success",
				message: "password changed successfully",
			});
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});
const ChangeEmailCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const { email } = req?.body;
		const { password } = req?.body;
		const { newEmail } = req?.body;
		const loginUser = req.user;
		if (email === newEmail)
			throw new Error("old and new Email can't be the same");
		if (email !== loginUser.email) throw new Error("invalid credentials");

		// console.log(loginUser)
		const foundUser = await User.findOne({ email: email });
		const isPasswordMatch = await foundUser.isPasswordCorrect(password);
		if (!isPasswordMatch) throw new Error("invalid credentials");

		const verificationToken = await foundUser.accountVerificationHandler();
		await foundUser.save();

		const emailToSend = emailChangeVerificationHtml(
			foundUser.firstName,
			verificationToken,
			newEmail
		);
		let mailDetails = {
			from: "pascalazubike003@gmail.com",
			to: `${newEmail}`,
			subject: "Account Email Change activation token",
			html: emailToSend,
		};

		mailTransporter.sendMail(mailDetails, function (err, data) {
			if (err) {
				// "throw new Error("failed to send message");"
				res.status(500).json({ message: "failed to send message" });
			} else {
			}
		});
		updateduser = await User.findByIdAndUpdate(
			foundUser._id,
			{
				email: newEmail,
				isAccountVerified: false,
			},
			{
				new: true,
				runValidators: true,
			}
		);

		res.json({
			message:
				"email change successfully, check your email to verify your new email",
			mailDetails,
		});
		return;
	} catch (error) {
		res.status(500).json({
			status: "failed",
			message: error.message,
		});
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//       profile photo upload
// '''''''''''''''''''''''''''''''''''''''''''''

const profilePhotoUploadCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const { id } = req.user;
		const user = await User.findById(id);
		const data = req.body;

		const imageLocalPath = `public/images/profile/${req?.file?.fileName}`;

		uploadedImage = await handleCloudinaryUpload(
			imageLocalPath,
			`mern-blog-app/${user.email}/profilePhoto`
		);

		// remove the file
		fs.unlink(imageLocalPath, (err) => {
			if (err) {
				res.status(500).json({ message: "failed to  upload image" });
				return;
			} else {
				console.log("File deleted successfully");
			}
		});

		if (data.whatUploading === "profilePhoto") {
			user.profilePhoto = uploadedImage.url;
			user.blurProfilePhoto = req.blurProfilePhoto;
			await user.save();

			res.send({
				message: "profile photo uploaoded successfully",
				userImage: user.profilePhoto,
				blurProfilePhoto: user.blurProfilePhoto,
				whatUploading: data.whatUploading,
			});
			return;
		}
		if (data.whatUploading === "coverPhoto") {
			user.coverPhoto = uploadedImage.url;
			user.blurCoverPhoto = req.blurProfilePhoto;
			await user.save();

			res.send({
				message: "cover image uploaoded successfully",
				userImage: user.coverPhoto,
				blurCoverPhoto: user.blurCoverPhoto,
				whatUploading: data.whatUploading,
			});
			return;
		}
	} catch (error) {
		res.status(500).json({
			status: "failed",
			message: "failed to upload file try again",
		});
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//       save post
// '''''''''''''''''''''''''''''''''''''''''''''

const savePostCtrl = expressAsyncHandler(async (req, res) => {
	const loginUserId = req?.user.id;
	const { postId } = req?.body;

	try {
		let savedPost = await SavedPosts.findOneAndUpdate(
			{ post: postId, user: loginUserId },
			{ $set: { updatedAt: new Date() } },
			{ upsert: true, new: true }
		).populate({
			path: "post",
			select: ["image", "title", "createdAt", "blurImageUrl"],
		});
		res
			.status(200)
			.json({ message: "Post saved successfully", savedPost });
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ status: "faild", message: "saving post failed try again" });
	}
});
const fetchRandomUserCtrl = expressAsyncHandler(async (req, res) => {
	const { numberOfUser } = req.body;

	try {
		const users = await User.aggregate([
			{ $sample: { size: numberOfUser } },
			{
				$project: {
					firstName: 1,
					lastName: 1,
					profession: 1,
					_id: 1,
					profilePhoto: 1,
					blurProfilePhoto: 1,
				},
			},
		]);

		res.json({ users });
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

const fetchUserFollowingListCtrl = expressAsyncHandler(
	async (req, res) => {
		const pageNumber = parseInt(req.query.pageNumber) || 1; // Current page number, default to 1
		const numberPerPage = parseInt(req.query.numberPerPage) || 10; // Number of items per page

		const userId = req.query.userId;
		const skip = (pageNumber - 1) * numberPerPage;

		try {
			const { following } = await User.findById(userId)
				.populate({
					path: "following",
				})
				.select("following");
			const userfollowinglist = await User.findById(userId)
				.populate({
					path: "following",
					options: { sort: { _id: 1 } },
					select: [
						"_id",
						"firstName",
						"lastName",
						"profilePhoto",
						"blurProfilePhoto",
						"profession",
					],
					limit: numberPerPage,
					skip: skip,
				})
				.select("following");

			const followinglistTotalNumber = following.length;
			res.status(200).json({
				followinglistTotalNumber,
				userfollowinglist: userfollowinglist,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
);
const fetchUserFollowersListCtrl = expressAsyncHandler(
	async (req, res) => {
		const pageNumber = parseInt(req.query.pageNumber) || 1; // Current page number, default to 1
		const numberPerPage = parseInt(req.query.numberPerPage) || 10; // Number of items per page

		const userId = req.query.userId;
		const skip = (pageNumber - 1) * numberPerPage;

		try {
			const { followers } = await User.findById(userId)
				.populate({
					path: "followers",
				})
				.select("followers");
			const userfollowerslist = await User.findById(userId)
				.populate({
					path: "followers",
					options: { sort: { _id: 1 } },
					select: [
						"_id",
						"firstName",
						"lastName",
						"profilePhoto",
						"blurProfilePhoto",
						"profession",
					],
					limit: numberPerPage,
					skip: skip,
				})
				.select("followers");

			const followerslistTotalNumber = followers.length;
			res.status(200).json({
				followerslistTotalNumber,
				userfollowerlist: userfollowerslist,
			});
		} catch (error) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
);

const fetchUserCountsCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const userFound = await User.findById(req.user._id).populate("Posts");

		const followersCount = userFound?.followers?.length;
		const followingCount = userFound.following.length;
		const postCount = userFound?.Posts.length;

		const Posts = userFound?.Posts;

		let likesCount = 0;
		let viewsCount = 0;
		let disLikesCount = 0;
		for (const post of Posts) {
			viewsCount += post.numViews;
			likesCount += post.likes.length;
			disLikesCount += post.disLikes.length;
		}

		res.status(200).json({
			status: "success",
			followersCount,
			postCount,
			likesCount,
			disLikesCount,
			viewsCount,
			followingCount,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			status: "failed",
			message: "fetching User details count failed try again",
		});
	}
});

const fetchWhoViewedUserProfileCtrl = expressAsyncHandler(
	async (req, res) => {
		const page = req.query.page;
		const numberPerPage = req.query.numberPerPage;
		const { _id } = req.user;
		if (!_id) throw new Error("User Id is Required");

		try {
			const usersViewedJustForLength = await User.findById(_id).populate({
				path: "userWhoViewProfile",
				populate: {
					path: "viewedBy",
				},
			});

			const whoViewUserProfileCount =
				usersViewedJustForLength.userWhoViewProfile.length;
			const { userWhoViewProfile } = await User.findById(_id).populate({
				path: "userWhoViewProfile",
				options: { sort: { updatedAt: -1 } },
				skip: (page - 1) * numberPerPage,
				limit: numberPerPage,
				populate: {
					path: "viewedBy",
					select: [
						"_id",
						"firstName",
						"lastName",
						"profilePhoto",
						"blurProfilePhoto",
						"profession",
					],
				},
			});

			res.status(200).json({
				status: "success",
				userWhoViewProfile,
				whoViewUserProfileCount,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ status: "failed", message: error.message });
		}
		// const deleted = await User.updateMany({}, { $unset: { viewedBy: 1 } });
		// console.log(deleted);
		// res.status(200).json({
		// 	message: `successfully deleted ${deleted}`,
		// });
	}
);

const fetchPostImpressionsCount = expressAsyncHandler(async (req, res) => {
	const userId = req.user._id;

	const { filter } = req.query;
	const page = parseInt(req.query.page) || 1; // Current page number, default to 1
	const numberPerPage = parseInt(req.query.numberPerPage) || 10; // Number of items per page
	// "likes and dislikes", "number of views";
	// console.log(filter);
	try {
		const { Posts } = await User.findById(userId).populate({
			path: "Posts",
			select: ["likes", "disLikes", "numViews", "title"],
		});
		const postsTitle = Posts.map((post) => post.title);

		if (filter === "likes and dislikes") {
			const likesDataset = Posts.map((post) => post.likes.length);
			const disLikesDataset = Posts.map((post) => post.disLikes.length);

			res.status(200).json({
				likesDataset,
				disLikesDataset,
				postsTitle,
			});
			return;
		}

		if (filter === "number of views") {
			const numViewDataset = Posts.map((post) => post.numViews);

			res.status(200).json({
				numViewDataset,
				postsTitle,
			});
			return;
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

const fetchAllUserCtrl = expressAsyncHandler(async (req, res) => {
	const { filter, searchTerm } = req.query;

	const page = parseInt(req.query.page) || 1;
	const numberPerPage = parseInt(req.query.numberPerPage) || 10;
	const regexPattern = new RegExp(`.*${searchTerm}.*`, "i");

	const sortingObject = filterUserCriteria(filter);
	let searchQuery;

	if (searchTerm) {
		if (isValidObjectId(searchTerm)) {
			searchQuery = { _id: new mongoose.Types.ObjectId(searchTerm) };
		} else {
			searchQuery = {
				$or: [
					{ firstName: { $regex: regexPattern } },
					{ lastName: { $regex: regexPattern } },
					{ email: { $regex: regexPattern } },
				],
			};
		}
	} else {
		searchQuery = {};
	}

	try {
		const users = await User.aggregate([
			{
				$match: searchQuery,
			},
			{
				$lookup: {
					from: "posts",
					localField: "_id",
					foreignField: "user",
					as: "Posts",
				},
			},
			{
				$addFields: {
					followersCount: { $size: "$followers" },
					followingCount: { $size: "$following" },
					postsCount: { $size: "$Posts" },
				},
			},

			{
				$sort: sortingObject,
			},
			{
				$skip: (page - 1) * numberPerPage,
			},
			{
				$limit: numberPerPage,
			},
			{
				$project: {
					firstName: 1,
					lastName: 1,
					email: 1,
					createdAt: 1,
					isBlocked: 1,
					followersCount: "$followersCount",
					followingCount: "$followingCount",
					postsCount: "$postsCount",
				},
			},
		]);

		const totalUsers = await User.countDocuments({});
		const totalPages = Math.ceil(totalUsers / numberPerPage);

		res.json({
			currentPage: page,
			totalPages: totalPages,
			users: users,
			totalNumber: totalUsers,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

const blockOrUnblockUserCtrl = expressAsyncHandler(async (req, res) => {
	const { action, userId } = req.body;
	const foundUser = await User.findById(userId);

	try {
		if (action === "block") {
			const blockUser = await User.findByIdAndUpdate(
				userId,
				{
					isBlocked: true,
				},
				{ new: true }
			).select(["_id", "firstName", "lastName", "isBlocked"]);

			res.status(200).json({
				message: `${blockUser.firstName} ${blockUser.lastName} has been successfully block`,
				user: blockUser,
			});
			return;
		}
		if (action === "unblock") {
			const unblockUser = await User.findByIdAndUpdate(
				userId,
				{
					isBlocked: false,
				},
				{
					new: true,
				}
			).select(["_id", "firstName", "lastName", "isBlocked"]);

			res.status(200).json({
				message: `${unblockUser.firstName} ${unblockUser.lastName} has been successfully unblock`,
				user: unblockUser,
			});
			return;
		}
	} catch (error) {
		console.log(error);
	}
});

const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
	const { userIds } = req.body;

	try {
		const deletedUsers = await User.deleteMany({
			_id: { $in: userIds },
		});

		res.status(200).json({
			message: `successfully deleted ${deletedUsers.deletedCount} users`,
			userIds,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: "failed to delete post" });
	}
});

module.exports = {
	userRegisterCtrl,
	userLoginCtrl,
	userLoginWithTokenCtrl,
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
	savePostCtrl,
	fetchRandomUserCtrl,
	fetchUserFollowingListCtrl,
	fetchUserFollowersListCtrl,
	fetchUserCountsCtrl,
	fetchWhoViewedUserProfileCtrl,
	fetchPostImpressionsCount,
	blockOrUnblockUserCtrl,
	ChangeEmailCtrl,
};
