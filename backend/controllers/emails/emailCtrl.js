const expressAsyncHandler = require("express-async-handler");
const mailTransporter = require("../../config/sendEmail/sendEmailConfig");
const EmailMsg = require("../../model/emailMessaging");
const checkProfanity = require("../../utils/profanWords");

// '''''''''''''''''''''''''''''''''''''''''
//   creating email messaging
// ''''''''''''''''''''''''''''''''''''''''''''

const createEmailMsgCtrl = expressAsyncHandler(async (req, res) => {
	const { to, subject, message } = req?.body;

	if (checkProfanity(subject + " " + message)) {
		throw new Error(
			"message not sent, because it contains profane wordss"
		);
	}
	console.log("im still working");
	let mailDetails = {
		from: "pascalazubike003@gmail.com",
		to,
		subject,
		text: message,
	};
	mailTransporter.sendMail(mailDetails, async function (err, data) {
		if (err) {
			res.json({ err });
		} else {
			try {
				const emailMsg = await EmailMsg.create({
					from: "pascalazubike003@gmail.com",
					to: to,
					message: message,
					subject: subject,
					sentBy: req?.user?._id,
				});
				res.json(emailMsg);
			} catch (error) {
				res.json(error);
			}
		}
	});
});

module.exports = { createEmailMsgCtrl };
