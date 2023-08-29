import React from "react";
import NavBar from "./NavBar";

const Login = () => {
	return (
		<div>
			<NavBar />
			<div className="h-screen flex justify-center md:grid items-center  px-8 grid-cols-2 md:p-8 shadow-lg font-helvetica font-light">
				<div className=" hidden md:flex flex-col p-9 bg-gray-100 mr-6 shadow-md justify-center items-center">
					<h1 className=" font-medium">
                    Get Ready to Be Inspired
					</h1>
					<p className=" font-light text-gray-400 text-xs mt-5 mb-[3.5rem] max-w-md">
                    Explore our latest blog posts and embark on a journey of discovery
					</p>
					<img
						className=" w-[22rem] h-[11rem] rounded-lg"
						src="win1.jpg"
						alt=""
					/>
				</div>

				<div className="s">
					<div>
						<div className="flex flex-col justify-center items-center mb-6">
							<p className=" text-lg font-medium mb-3">Welcome Back</p>
							<p className=" text-gray-400 text-sm">
                            Login to access your personalized journey
							</p>
						</div>
					</div>
					<form className="">
						<div className=" max-w-md">
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
							Don't Have an account?
							<span>
								<a
									className=" text-blue-600 ml-2 hover:text-blue-400 transition-all"
									href="#"
								>
									Register
								</a>
							</span>
						</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
