import React from "react";
import { NavBar } from "../components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import Carousel from "../utils/carousel";
import { RegisterUser } from "../redux/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { LoadingSpinner } from "../utils/Spinner";

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
			dispatch(RegisterUser(values));
		},
		validationSchema: formSchema,
	});
	const isLoading = useSelector((store) => store.userSlice.isLoading);
	const dispatch = useDispatch();

	return (
		<div className="h-screen flex justify-center md:grid place-items-center place-content-center px-3 grid-cols-2 md:p-8  font-helvetica font-light">
			<NavBar/>
			<div className=" hidden md:flex flex-col p-9 bg-gray-100 mr-6 shadow-sm justify-center items-center">
				<h1 className=" font-medium">
					Join Our Community and Start Sharing Your Story!
				</h1>
				<p className=" font-light text-gray-400 text-xs mt-5 mb-[3.5rem] max-w-md">
					Be a part of our vibrant community where your voice matters. Sign
					up now and let your journey as a blogger begin!
				</p>
				<Carousel />
			</div>

			{/* form starts here */}
			<form
				onSubmit={formik.handleSubmit}
				className="flex flex-col w-full  items-center px-8 py-6 lg:px-20"
			>
				<div className=" items-center flex flex-col  mb-6">
					<p className=" text-lg font-medium mb-3">Get Started</p>
					<p className=" text-gray-400 text-sm">
						Create your free Account
					</p>
				</div>

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
				<div className=" relative mb-2 self-start ">
					<h1 className=" form-error-text  ">
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
				<div className=" relative mb-2 self-start ">
					<h1 className=" form-error-text  ">
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
				<div className=" relative mb-2 self-start ">
					<h1 className=" form-error-text ">
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
				<div className=" relative mb-2 self-start ">
					<h1 className=" form-error-text ">
						{formik.touched.password && formik.errors.password}
					</h1>
				</div>
				<button type="submit" className="form-btn mt-4">
					{isLoading ? <LoadingSpinner /> : "Register"}
				</button>

				<div className=" mt-8">
					<h3 className=" font-light font-helvetica text-gray-500">
						Already Have an account?
						<span>
							<Link
								className=" text-blue-600 ml-2 hover:text-blue-400 transition-all"
								href="#"
								to="/login"
							>
								Login
							</Link>
						</span>
					</h3>
				</div>
			</form>
		</div>
	);
};

export default Register;
