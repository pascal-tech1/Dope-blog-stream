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
const { default: mongoose } = require("mongoose");
const { filterUserCriteria } = require("../../utils/filterSortCriteria");

// '''''''''''''''''''''''''''''''''''''''''
//         Register user
// '''''''''''''''''''''''''''''''''''''''''''''

const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	// finding if user exist in mongoDb database using the mongodb findOne method
	const userExist = await User.findOne({ email });
	if (userExist) throw new Error("User already Exist");

	try {
		const user = await User.create({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password,
		});
		ress.status(201).json({
			status: "success",
			message: "account created successfully",
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

	const userFound = await User.findOne({
		email: req?.body?.email,
	}).select([
		"_id",
		"firstName",
		"lastName",
		"profilePhoto",
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
	} else {
		res.status(500).json({
			status: "failed",
			message: "login failed invalid credential login",
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
	]);
	res.status(200).json({
		status: "success",
		user: userFound,
	});
});

// '''''''''''''''''''''''''''''''''''''''''
//         fetch All user
// '''''''''''''''''''''''''''''''''''''''''''''

// '''''''''''''''''''''''''''''''''''''''''
//         delete single user with id
// '''''''''''''''''''''''''''''''''''''''''''''

const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
	const { USERID } = req.params;
	validateMongoDbUserId(USERID);

	try {
		const deletedUser = await User.findByIdAndRemove(USERID);
		res.json(deletedUser);
	} catch (error) {
		res.json(error);
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//        fetch single user details
// '''''''''''''''''''''''''''''''''''''''''''''
const fetchUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
	console.log("im here");
	const { userId } = req.params;
	const loginUserId = req.user._id;
	validateMongoDbUserId(userId);

	try {
		const foundUser = await User.findById(userId)
			.select([
				"_id",
				"firstName",
				"lastName",
				"profilePhoto",
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
			])
			.populate({
				path: "following",
				select: ["_id", "firstName", "lastName", "profilePhoto"],
			});

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

		res.status(200).json({ foundUser });
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
			"email",
			"profession",
			"location",
			"language",
			"education",
			"isBlocked",
			"isAdmin",
			"bio",
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

const updatePasswordCtrl = expressAsyncHandler(async (req, res) => {
	const { _id } = req?.user;
	validateMongoDbUserId(_id);

	const { password } = req?.body;

	const foundUser = await User.findById(_id);

	if (!password) res.json(foundUser);
	foundUser.password = password;
	const updatedUser = await foundUser.save();
	res.json(updatedUser);
});

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
	).select(["_id", "firstName", "lastName", "profilePhoto"]);

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
		console.log(__dirname);
		const loginUserId = req.user.id;
		const foundUser = await User.findById(loginUserId);
		const verificationToken = await foundUser.accountVerificationHandler();
		await foundUser.save();
		let mailDetails = {
			from: "pascalazubike003@gmail.com",
			to: `pascalazubike003@gmail.com`,
			subject: "Full Stack Developer Position",
			html: email,
			attachments: [
				{
					filename: "pascal-resume.pdf", // Customize the filename
					path: path.join(__dirname, "pascal-resume.pdf"), // Specify the path to your PDF file
				},
			],
		};

		mailTransporter.sendMail(mailDetails, function (err, data) {
			if (err) res.json(err);
			res.json(mailDetails);
		});
	}
);
const AcctVerificationCtrl = expressAsyncHandler(async (req, res) => {
	const { verificationToken } = req?.body;
	const acctVerificationToken = crypto
		.createHash("sha256")
		.update(verificationToken)
		.digest("hex");

	const foundUser = await User.findOne({
		accountVerificationToken: acctVerificationToken,
		accountVerificationTokenExpires: { $gt: new Date() },
	});
	if (!foundUser) throw new Error("Token expired, try again");
	foundUser.isAccountVerified = true;
	foundUser.accountVerificationToken = undefined;
	foundUser.accountVerificationTokenExpires = undefined;
	await foundUser.save();

	let mailDetails = {
		from: "pascalazubike003@gmail.com",
		to: "pascalazubike0000000000@gmaiiil.com",
		subject: "Mern-blog-app Email verification",
		html: `
    <h1>Email Verification</h1>
    <p>your email successfully verified!`,
	};

	mailTransporter.sendMail(mailDetails, function (err, data) {
		if (err) res.json(err);
		res.json(mailDetails);
	});
});

// '''''''''''''''''''''''''''''''''''''''''
//        sending the user the password reset link to their email
// '''''''''''''''''''''''''''''''''''''''''''''

const sendPasswordResetEmailCtrl = expressAsyncHandler(
	async (req, res) => {
		const { userEmail } = req?.body;

		const foundUser = await User.findOne({ email: userEmail });
		if (!foundUser) throw new Error("User not found");

		try {
			const resetToken = await foundUser.passwordResetHandler();
			await foundUser.save(); // this save the user info altered in passwordResetHandler in the user model

			let mailDetails = {
				from: "pascalazubike003@gmail.com",
				to: `${foundUser.email}`,
				subject: "Mern-blog-app Email verification",
				html: `
                      <h1>Password Reset</h1>
                       <p>You have requested to reset your password. Please click the link below to reset your password:</p>
                       <a href="http://localhost:5000/api/users/forget-password/${resetToken}">Reset Password</a>
                       <p>If you didn't initiate this password reset, please contact the MERN Blog App admin immediately.</p>
                         `,
			};

			mailTransporter.sendMail(mailDetails, function (err, data) {
				if (err) res.json(err);
				res.send(mailDetails);
			});
		} catch (error) {
			res.json(error);
		}
	}
);

// '''''''''''''''''''''''''''''''''''''''''
//       reset the user password after they have successfully click the mail send
// '''''''''''''''''''''''''''''''''''''''''''''

const resetPasswordCtrl = expressAsyncHandler(async (req, res) => {
	const { newPassword } = req?.body;
	const { resetToken } = req?.body;

	const hashedPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
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
});

// '''''''''''''''''''''''''''''''''''''''''
//       profile photo upload
// '''''''''''''''''''''''''''''''''''''''''''''

const profilePhotoUploadCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const { id } = req.user;
		const user = await User.findById(id);

		const imageLocalPath = `public/images/profile/${req?.file?.fileName}`;

		uploadedImage = await handleCloudinaryUpload(
			imageLocalPath,
			`mern-blog-app/${user.email}/profilePhoto`
		);

		user.profilePhoto = uploadedImage.url;

		await user.save();
		// remove the file
		// if (fs.existsSync(imageLocalPath)) {
		// 	fs.unlink(imageLocalPath);
		// } else {
		// 	throw new Error("No valid file path found for deletions");
		// }

		res.send({ message: "image uploaoded successfully" });
	} catch (error) {
		res.json(error);
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//       save post
// '''''''''''''''''''''''''''''''''''''''''''''

const savePostCtrl = expressAsyncHandler(async (req, res) => {
	const loginUserId = req?.user.id;
	const { postId } = req?.body;

	try {
		validateMongoDbUserId(postId);
		const { savedPost } = await User.findById(loginUserId).select(
			"savedPost"
		);

		if (savedPost.includes(postId)) {
			await User.findByIdAndUpdate(loginUserId, {
				$pull: { savedPost: postId },
			});
			const { savedPost } = await User.findByIdAndUpdate(
				loginUserId,
				{
					$push: { savedPost: postId },
				},
				{
					new: true,
				}
			)

				.populate("savedPost")
				.select("savedPost")
				.sort({
					createdAt: -1,
				});
			res.status(200).json({
				message: "post is already in your saved post",
				savedPost,
			});

			return;
		} else {
			const { savedPost } = await User.findByIdAndUpdate(
				loginUserId,
				{
					$push: { savedPost: postId },
				},
				{
					new: true,
				}
			)

				.populate("savedPost")
				.select("savedPost")
				.sort({
					createdAt: -1,
				});
			res.status(200).json({
				message: "post saved Successfully",
				savedPost,
			});
			return;
		}
	} catch (error) {
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
			const { following } = await User.findById(userId).select(
				"following"
			);
			const userfollowinglist = await User.findById(userId)
				.populate({
					path: "following",
					options: { sort: { _id: 1 } },
					select: [
						"_id",
						"firstName",
						"lastName",
						"profilePhoto",
						"profession",
					],
					limit: numberPerPage,
					skip: skip,
				})
				.select("following");
			console.log(userfollowinglist);
			const followinglistTotalNumber = following.length;
			res.status(200).json({
				followinglistTotalNumber,
				userfollowinglist: userfollowinglist,
			});
		} catch (error) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
);
const fetchUserFollowersListCtrl = expressAsyncHandler(
	async (req, res) => {
		const pageNumber = parseInt(req.query.pageNumber) || 1; // Current page number, default to 1
		const numberPerPage = parseInt(req.query.numberPerPage) || 10; // Number of items per page
		console.log("im hereeee dcdtl");
		const userId = req.query.userId;
		const skip = (pageNumber - 1) * numberPerPage;

		try {
			const { followers } = await User.findById(userId).select(
				"followers"
			);
			const userfollowerslist = await User.findById(userId)
				.populate({
					path: "followers",
					options: { sort: { _id: 1 } },
					select: [
						"_id",
						"firstName",
						"lastName",
						"profilePhoto",
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
		console.log(req.user._id);

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
		const { _id } = req.user;
		if (!_id) throw new Error("User Id is Required");

		try {
			const { userWhoViewProfile } = await User.findById(_id).populate({
				path: "userWhoViewProfile",

				populate: {
					path: "viewedBy",
					select: [
						"_id",
						"firstName",
						"lastName",
						"profilePhoto",
						"profession",
					],
				},
			});

			res.status(200).json({ status: "success", userWhoViewProfile });
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
	const { filter } = req.query;
	const page = parseInt(req.query.page) || 1;
	const numberPerPage = parseInt(req.query.numberPerPage) || 10;

	const sortingObject = filterUserCriteria(filter);
	console.log(page);
	console.log(numberPerPage);

	try {
		const users = await User.aggregate([
			{
				$lookup: {
					from: "posts", // Change this to the actual name of your Posts collection
					localField: "_id",
					foreignField: "user", // Assuming there's a field in Posts that references the User
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
	AcctVerificationCtrl,
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
};
