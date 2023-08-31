import React from "react";
import { NavBar } from "../components";
import { useFormik } from "formik";
import * as Yup from "yup";

const Register = () => {
	const formSchema = Yup.object().shape({
		firstName: Yup.string()
			.required("First Name is Required.")
			.min(1, "First Name is Too Short."),
		lastName: Yup.string()
			.required("Last Name is Required.")
			.min(1, "Last Name is Too Short."),
		email: Yup.string().email().required("Email is Required."),
		password: Yup.string()
			.required("No password provided.")
			.min(8, "Password is too short - should be 8 chars minimum.")
			.matches(/(?=.*[0-9])/, "Password must contain a number."),
	});

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
		},

		onSubmit: (values) => {
			console.log("im here");
			// const user = {
			// 	email: values.email,
			// 	password: values.password,
			// };
			console.log(values);
		},
		validationSchema: formSchema,
	});
	return (
		<div>
			<div className=" h-screen mt-8  md:grid place-items-center px-8 grid-cols-2 md:p-8  font-helvetica font-light">
				<div className=" hidden md:flex flex-col p-9 bg-gray-100 mr-6 shadow-md justify-center items-center">
					<h1 className=" font-medium">
						Join Our Community and Start Sharing Your Story!
					</h1>
					<p className=" font-light text-gray-400 text-xs mt-5 mb-[3.5rem] max-w-md">
						Be a part of our vibrant community where your voice matters.
						Sign up now and let your journey as a blogger begin!
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
							<p className=" text-lg font-medium mb-3">Get Started</p>
							<p className=" text-gray-400 text-sm">
								Create your free Account
							</p>
						</div>
					</div>
					<form className="">
						<div className=" max-w-md">
							<label className="form-label " htmlFor="name">
								First Name
							</label>
							<input
								value={formik.values.firstName}
								onChange={formik.handleChange("firstName")}
								onBlur={formik.handleBlur("firstName")}
								aria-label="Enter your first name"
								type="text"
								className="form-input"
							/>
							<div className=" relative mb-2">
								<h1 className=" absolute top-[-0.9rem] left-0 bg-red-200 rounded-lg pl-3 text-xs ">
									{formik.touched.firstName && formik.errors.firstName}
								</h1>
							</div>
							<label className=" form-label" htmlFor="name">
								Last Name
							</label>
							<input
								value={formik.values.lastName}
								onChange={formik.handleChange("lastName")}
								onBlur={formik.handleBlur("lastName")}
								aria-label="Enter your last name"
								type="text"
								className=" form-input"
							/>
							<div className=" relative mb-2">
								<h1 className=" absolute top-[-0.9rem] left-0 bg-red-200 rounded-lg pl-3 text-xs ">
									{formik.touched.lastName && formik.errors.lastName}
								</h1>
							</div>
							<label className=" form-label" htmlFor="email">
								Email
							</label>
							<input
								value={formik.values.email}
								onChange={formik.handleChange("email")}
								onBlur={formik.handleBlur("email")}
								aria-label="Enter your email"
								type="email"
								className=" form-input"
							/>
							<div className=" relative mb-2">
								<h1 className=" absolute top-[-0.6rem] left-0 bg-red-200 rounded-lg pl-3 text-xs ">
									{formik.touched.email && formik.errors.email}
								</h1>
							</div>
							<label className=" form-label" htmlFor="password">
								Password
							</label>
							<input
								value={formik.values.password}
								onChange={formik.handleChange("password")}
								onBlur={formik.handleBlur("password")}
								aria-label="Enter you password"
								type="password"
								className="form-input"
							/>
							<div className=" relative mb-2">
								<h1 className=" absolute top-[-0.9rem] left-0 bg-red-200 rounded-lg pl-3 text-xs ">
									{formik.touched.password && formik.errors.password}
								</h1>
							</div>
							<button type="submit" className="form-btn mt-4">
								Login
							</button>
						</div>
					</form>
					<div className=" mt-4 mb-8">
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
