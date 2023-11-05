const expressAsyncHandler = require("express-async-handler");
const mailTransporter = require("../../config/sendEmail/sendEmailConfig");

const checkProfanity = require("../../utils/profanWords");
const Message = require("../../model/message/message");
const User = require("../../model/user/User");

// '''''''''''''''''''''''''''''''''''''''''
//   creating email messaging
// ''''''''''''''''''''''''''''''''''''''''''''

const createMsgCtrl = expressAsyncHandler(async (req, res) => {
	const { receiverId, message } = req?.body;
	if (checkProfanity(" " + message)) {
		throw new Error(
			"message not sent, because it contains profane wordss"
		);
	}
	
	const senderId = req.user._id;

	const receiverInfo = await User.findById(receiverId).select("email");
	const senderInfo = await User.findById(senderId).select([
		"firstName",
		"lastName",
	]);
	const subject = `Message from BlogVana user  ${senderInfo?.firstName} ${senderInfo?.lastName}`;
	
	let mailDetails = {
		from: "pascalazubike003@gmail.com",
		to: "pascalazubike003@gmail.com",
		subject,
		text: message,
	};
	mailTransporter.sendMail(mailDetails, async function (err, data) {
		if (err) {
			res.json({
				status: "failed",
				message: "sending message failed try again",
			});
		} else {
			try {
				await Message.create({
					sender: senderId,
					message: message,
					receiver: receiverId,
				});
				res.json({
					status: "success",
					message: "Message sent successfully",
				});
			} catch (error) {
				console.log(error);
			}
		}
	});
});

const fetchMsgCtrl = expressAsyncHandler(async (req, res) => {
	
	const page = req.params.page;
	const numberPerPage = req.params.numberPerPage;
	try {
		const userId = req.user._id;
		const { receivedMessages } = await User.findById(userId)
			.populate({
				path: "receivedMessages",

				options: { sort: { updatedAt: -1 } },
				skip: (page - 1) * numberPerPage,
				limit: numberPerPage,
				populate: {
					path: "sender",
					select: ["_id", "firstName", "lastName", "profilePhoto"],
				},
			})
			.select("receivedMessages");
		
		res.status(200).json({ status: "success", receivedMessages });
	} catch (error) {
		res.status(500).json({
			status: "failed",
			messages: "fetching messages failed try again",
		});
	}
});
module.exports = { createMsgCtrl, fetchMsgCtrl };
