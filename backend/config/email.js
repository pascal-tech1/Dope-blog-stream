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

				border-top-right-radius: 1rem;
				border-top-left-radius: 1rem;
				font-weight: 700;
			}
			.header h1 {
				padding: 20px;
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
				padding-top: 10px;
				padding-bottom: 10px;
			}
			.footer span {
				font-size: 20px;
				vertical-align: middle;
			}
			.footer p {
				display: inline;
				margin-left: 10px;
				margin-right: 10px;
               
			}
            .email-icon{
                color: black;
            }
            .phone-icon{
                color: black;
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
				<h1 style="color: white"> Full Stack Developer Position</h1>
			</div>
			<div class="content">
				<div style="padding: 15px; border-radius: 5px">
					<p style="font-weight: 600">Dear Hiring Manager,</p>
					<p>
						I am writing to express my strong interest in the Full Stack Developer position at your organization. With a background in web development and a solid track record in creating both front-end and back-end solutions, I am eager to contribute my skills to your team.
					</p>
					<p>
                        In my years of experience in full-stack development, I have developed user-friendly websites, optimized web performance, and managed databases. I am proficient in HTML, CSS, JavaScript, Redux tollkit, tailwind css and  React framework. On the back-end, I have worked with node js as a server side language and Mongodb, firebase as database.
					</p>
					<p>
                        I hold a B.Sc in mathematics and Computer Science and have a strong passion for web development. My analytical skills, organizational skills, attention to detail, and problem-solving abilities have enabled me to deliver successful projects on time.
					</p>
					<p>
						I have attached my resume for your review. I am excited about the opportunity to work with your team and contribute to your organization's growth.

Thank you for considering my application. I look forward to the possibility of discussing how I can contribute to your team further in an interview.
					</p>
					
					<p>Best regards,</p>
					<p>Adoh Azubike Pascal</p>
				</div>
			</div>
			<div class="footer">
				<h3>&copy; Pascal</h3>
				<p>
					<p class="phone-icon">&#9742;</p>
					<a
						href="tel:09029048188"
						style="color: white; text-decoration: none"
						>Phone</a
					>
				</p>
				<p>
					
                    <p class="email-icon">&#9993;</p>
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