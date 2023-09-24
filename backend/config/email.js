const email = `<!DOCTYPE html>
<html>
	<head>
		<style>
			body {
				font-family: "Inter", sans-serif;
				background-color: #f2f2f2;
				margin: 0;
				padding: 0;
				height: 100vh;
			}
			.container {
				max-width: 600px;
				margin: 0 auto;
			}
			.header {
				background: linear-gradient(to right, #898717, #66ccff);
				text-align: center;
				padding: 5px;
				border-top-right-radius: 1rem;
				border-top-left-radius: 1rem;
				font-weight: 700;
				font-size: xx-large;
			}
			.header h1 {
				color: #fff;
			}
			.content {
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				padding: 20px;
				color: black;
				font-size: large;
			}
			.footer {
				background: linear-gradient(to right, #898717, #66ccff);
				text-align: center;
				padding: 10px;
				color: #fff;

				text-align: center;
				padding: 5px;
				border-bottom-right-radius: 1rem;
				border-bottom-left-radius: 1rem;

				font-weight: 500;
				font-size: large;
			}
			.footer span {
				font-size: 20px;
				vertical-align: middle;
			}
		</style>
		<!-- <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"> -->
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link
			href="https://fonts.googleapis.com/css2?family=Geologica:wght@100;200;300;400;500;600;700;800;900&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
			rel="stylesheet"
		/>
		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
		/>
	</head>
	<body>
		<div class="container">
			<div class="header">
				<p style="color: white">Adoh Azubike Pascal</p>
			</div>
			<div class="content">
				<div style="padding: 15px; border-radius: 5px">
					<p style="font-weight: 600">Dear Hiring Manager,</p>
					<p>
						Thank you for reaching out and considering my application for
						the Web Developer Tutor position at LS Academy. I'm excited
						about the opportunity to interview and learn more about how I
						can contribute to your team.
					</p>
					<p>
						I would like to schedule the screening interview for Monday,
						11/09/2023, at 2:00pm. Please feel free to send me the Google
						Meet link for the interview, and I'll be sure to mark my
						calendar accordingly.
					</p>
					<p>
						Once again, thank you for this opportunity, and I look forward
						to speaking with Mr Daniel O. and discussing my potential role at
						LS Academy.
					</p>

					<p>Best regards,</p>
					<p>Adoh Azubike Pascal</p>
				</div>
			</div>
			<div class="footer">
				<p>&copy; Pascal</p>
				<p>
					&#9742;
					<a
						href="tel:09029048188"
						style="color: white; text-decoration: none"
						>Phone</a
					>
				</p>
				<p>
					&#9993;
					<a
						href="mailto:pascalazubike003@gmail.com"
						style="color: white; text-decoration: none"
						>Email</a
					>
				</p>
			</div>
		</div>
	</body>
</html>

`;

module.exports = email;
