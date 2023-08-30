import React from "react";
import { NavBar } from "../components";

const Register = () => {
	return (
		<div>
			<NavBar />
			<div className="h-screen flex justify-center md:grid items-center  px-8 grid-cols-2 md:p-8 shadow-lg font-helvetica font-light">
				<div className=" hidden md:flex flex-col p-9 bg-gray-100 mr-6 shadow-md justify-center items-center">
					<h1 className=" font-medium">Join Our Community and Start Sharing Your Story!</h1>
					<p className=" font-light text-gray-400 text-xs mt-5 mb-[3.5rem] max-w-md" >
						Be a part of our vibrant community where your voice matters.
						Sign up now and let your journey as a blogger begin!
					</p>
					<img className=" w-[22rem] h-[11rem] rounded-lg" src="win1.jpg" alt="" />
				</div>

				<div className="s">
					<div>
						<div className="flex flex-col justify-center items-center mb-6">
							<p className=" text-lg font-medium mb-3">Get Started</p>
							<p className=" text-gray-400 text-sm">
								Create your free Account
							</p>
						</div>
					</div>
					<form className="">
						<div className=" max-w-md">
							<label className=" form-label" htmlFor="name">
								First Name
							</label>
							<input
								aria-label="Enter your first name"
								type="text"
								className="form-input"
							/>
							<label className=" form-label" htmlFor="name">
								Last Name
							</label>
							<input
								aria-label="Enter your last name"
								type="text"
								className=" form-input"
							/>
                            <label className=" form-label" htmlFor="email">
						Email
							</label>
							<input
								aria-label="Enter your email"
								type="email"
								className=" form-input"
							/>
							<label className=" form-label" htmlFor="password">
								Password
							</label>
							<input
								aria-label="Enter you password"
								type="password"
								
								className="form-input"
							/>
							<button type="submit" className="form-btn">
								Login
							</button>
						</div>
					</form>
					<div className=" mt-8">
						<h3 className=" font-light font-helvetica text-gray-500">
							Have an account?
							<span>
								<a
									className=" text-blue-600 ml-2 hover:text-blue-400 transition-all"
									href="#"
								>
									Login
								</a>
							</span>
						</h3>
					</div>
				</div>
			</div>
		</div>
		
	);
};

export default Register;
