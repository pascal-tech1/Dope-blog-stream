const emailVerificationHtml = (foundUser, verificationToken) => {
	return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta
			name="viewport"
			content="width=device-width, initial-scale=1.0"
		/>
		<style>
			body {
				font-family: "Arial", sans-serif;
				margin: 0;
				padding: 0;
				background-color: #f4f4f4;
			}
			.container {
				max-width: 600px;
				margin: 20px auto;
				padding: 20px;
				background-color: #ffffff;
				border-radius: 8px;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			}
			h2 {
				color: #333333;
			}
			p {
				color: #555555;
			}
			.verification-link {
				display: inline-block;
				padding: 10px 20px;
				background-color: #007bff;
				color: #ffffff;
				text-decoration: none;
				border-radius: 5px;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<h2>Account Verification</h2>
			<p>Dear ${foundUser.firstName},</p>
			<p>
				Thank you for creating an account. To activate your account, please
				click the verification link below:
			</p>
			<a href= "http://localhost:5173/confirm-sent-email/${verificationToken}?email=${foundUser.email}" class="verification-link"
				>Verify Your Email</a
			>
			<p>If you did not create an account, please disregard this email.</p>
			<p>Best regards,<br />BlogVana</p>
		</div>
	</body>
</html>`;
};
module.exports = emailVerificationHtml;