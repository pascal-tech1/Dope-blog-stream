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

	const senderId = req.user._id;

	const receiverInfo = await User.findById(receiverId).select("email");
	const senderInfo = await User.findById(senderId).select([
		"firstName",
		"lastName",
		"isBlocked",
		"isProfaneCount",
	]);
	if (checkProfanity(" " + message)) {
		senderInfo.isProfaneCount += 1;
		await senderInfo.save();
		if (senderInfo.isProfaneCount >= 3) {
			senderInfo.isBlocked = true;
			await senderInfo.save();
			res.status(401).json({
				status: "failed",
				isBlocked: true,
				message: "message contains profane words and account blocked",
			});
			return;
		} else {
			throw new Error(
				"message not sent, because it contains profane wordss, account will be block after the third time"
			);
		}
	}
	const subject = `Message from BlogVana user  ${senderInfo?.firstName} ${senderInfo?.lastName}`;

	let mailDetails = {
		from: "pascalazubike003@gmail.com",
		to: receiverInfo.email,
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
			} catch (error) {}
		}
	});
});

const fetchMsgCtrl = expressAsyncHandler(async (req, res) => {
	const page = req.query.page;
	const numberPerPage = req.query.numberPerPage;

	try {
		const userId = req.user._id;
		const messages = await User.findById(userId)
			.populate({
				path: "receivedMessages",
			})
			.select("receivedMessages");

		const receivedMessageCount = messages.receivedMessages.length;

		const { receivedMessages } = await User.findById(userId)
			.populate({
				path: "receivedMessages",

				options: { sort: { updatedAt: -1 } },
				skip: (page - 1) * numberPerPage,
				limit: numberPerPage,
				populate: {
					path: "sender",
					select: [
						"_id",
						"firstName",
						"lastName",
						"profilePhoto",
						"blurProfilePhoto",
					],
				},
			})
			.select("receivedMessages");

		res
			.status(200)
			.json({ status: "success", receivedMessages, receivedMessageCount });
	} catch (error) {
		res.status(500).json({
			status: "failed",
			messages: "fetching messages failed try again",
		});
	}
});
module.exports = { createMsgCtrl, fetchMsgCtrl };
