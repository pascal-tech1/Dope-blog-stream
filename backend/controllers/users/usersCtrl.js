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
		res.json(user);
	} catch (error) {
		res.json(error);
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//         login user
// '''''''''''''''''''''''''''''''''''''''''''''

const userLoginCtrl = expressAsyncHandler(async (req, res) => {
	// finding if user exist in mongoDb database using the mongodb findOne method

	const userFound = await User.findOne({ email: req?.body?.email });

	if (
		userFound &&
		(await userFound.isPasswordCorrect(req?.body?.password))
	) {
		res.status(200).json({
			status: "success",
			user: userFound,
			// generate a token that will be used to retain the login of the user
			token: generateJwtToken(userFound?._id),
		});
	} else {
		res.status(500).json({
			status: "failed",
			error: "invalid Login credentials Try again",
		});
	}
});
const userLoginWithTokenCtrl = expressAsyncHandler(async (req, res) => {
	res.status(200).json({
		status: "success",
		user: req?.user,
	});
});

// '''''''''''''''''''''''''''''''''''''''''
//         fetch All user
// '''''''''''''''''''''''''''''''''''''''''''''

const fetchAllUserCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const allUser = await User.find({});
		res.json(allUser);
	} catch (error) {
		res.json(error);
	}
});

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
	const { USERID } = req.params;
	validateMongoDbUserId(USERID);
	try {
		const foundUser = await User.findById(USERID)
			.select("-password")
			.populate("Posts");
		res.json(foundUser);
	} catch (error) {
		res.json(error);
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
		);
		res.json(updatedUser);
	} catch (error) {
		res.json(error);
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
	);

	const user = await User.findByIdAndUpdate(
		loginUserId,
		{
			$push: { following: userToFollowId },
		},
		{
			new: true,
			runValidators: true,
		}
	).select("-password");

	res.json({
		message: `you have successfully follow ${userToFollow?.firstName} ${userToFollow?.lastName}`,
		user,
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
			to: `careers@leinadstudios.com`,
			subject: "Screening Interview for Web Developer Tutor Position",
			html: email,
			// attachments: [
			// 	{
			// 		filename: "pascal-resume.pdf", // Customize the filename
			// 		path: path.join(__dirname, "pascal-resume.pdf"), // Specify the path to your PDF file
			// 	},
			// ],
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
};
