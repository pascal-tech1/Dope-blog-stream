import React from "react";
import { NavBar } from "../components";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
	const formSchema = Yup.object().shape({
		email: Yup.string().email().required("Email is Required."),
		password: Yup.string()
			.required("No password provided.")
			.min(8, "Password is too short - should be 8 chars minimum."),
	});

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},

		onSubmit: (values) => {
			console.log("im here");
			const user = {
				email: values.email,
				password: values.password,
			};
			console.log(values);
			console.log(values);
		},
		validationSchema: formSchema,
	});

	return (
		<div>
			<div className="h-screen mt-8  md:grid place-items-center px-8 grid-cols-2 md:p-8  font-helvetica font-light">
				<div className=" hidden md:flex flex-col p-9 bg-gray-100 mr-6 shadow-md justify-center items-center">
					<h1 className=" font-medium">Get Ready to Be Inspired</h1>
					<p className=" font-light text-gray-400 text-xs mt-5 mb-[3.5rem] max-w-md">
						Explore our latest blog posts and embark on a journey of
						discovery
					</p>
					<img
						className=" w-[22rem] h-[11rem] rounded-lg"
						src="win1.jpg"
						alt=""
					/>
				</div>

				<div className="">
					<div>
						<div className="flex flex-col justify-center items-center mb-6">
							<p className=" text-lg font-medium mb-3">Welcome Back</p>
							<p className=" text-gray-400 text-sm">
								Login to access your personalized journey
							</p>
						</div>
					</div>
					{/* form starts here */}
					<form onSubmit={formik.handleSubmit} className="">
						<div className=" max-w-md">
							<label className=" form-label" htmlFor="email">
								Email
							</label>
							<input
								aria-label="Enter your email"
								type="email"
								className=" form-input"
								value={formik.values.email}
								onChange={formik.handleChange("email")}
								onBlur={formik.handleBlur("email")}
							/>
							<div className=" relative mb-2">
								<h1 className=" absolute top-[-0.9rem] left-0 bg-red-200 rounded-lg pl-3">
									{formik.touched.email && formik.errors.email}
								</h1>
							</div>
							<label className=" form-label" htmlFor="password">
								Password
							</label>
							<input
								type="password"
								className="form-input"
								value={formik.values.password}
								onChange={formik.handleChange("password")}
								onBlur={formik.handleBlur("password")}
							/>
							<div className=" relative mb-2">
								<h1 className=" absolute top-[-0.9rem] left-0 bg-red-200 rounded-lg pl-3">
									{formik.touched.password && formik.errors.password}
								</h1>
							</div>
							<button type="submit" className="form-btn mt-4">
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
