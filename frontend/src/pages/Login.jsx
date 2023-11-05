import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../redux/user/userSlice";
import { LoadingSpinner } from "../utils/Spinner";
import { NavBar } from "../components";

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { user, isLoading } = useSelector((store) => store.userSlice);

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
			const user = {
				email: values.email,
				password: values.password,
			};
			dispatch(loginUser(user));
			if (user) {
				navigate("/");
			}
		},
		validationSchema: formSchema,
	});

	return (
		<div className="h-screen flex justify-center md:grid place-items-center place-content-center px-3 grid-cols-2 md:p-8  font-helvetica font-light">
			<NavBar />
			<div className=" hidden md:flex flex-col p-9 bg-gray-100 mr-6 shadow-sm justify-center items-center">
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

			{/* form starts here */}
			<form
				onSubmit={formik.handleSubmit}
				className="flex flex-col w-full  items-center px-8 py-6 lg:px-20"
			>
				<div className=" items-center flex flex-col  mb-6">
					<p className=" text-lg font-medium mb-3">Welcome Back</p>
					<p className=" text-gray-400 text-sm text-center">
						Login to access your personalized journey
					</p>
				</div>

				<label className=" form-label  " htmlFor="email">
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
				<div className=" relative mb-2 self-start">
					<h1 className=" form-error-text">
						{formik.touched.email && formik.errors.email}
					</h1>
				</div>
				<label className=" form-label" htmlFor="password">
					Password
				</label>
				<input
					type="password"
					className="form-input "
					value={formik.values.password}
					onChange={formik.handleChange("password")}
					onBlur={formik.handleBlur("password")}
				/>
				<div className=" relative mb-2 self-start">
					<h1 className=" form-error-text">
						{formik.touched.password && formik.errors.password}
					</h1>
				</div>
				<button type="submit" className="form-btn mt-4">
					{isLoading ? <LoadingSpinner /> : "login"}
				</button>

				<div className=" mt-8">
					<h3 className=" font-light font-helvetica text-gray-500">
						Don't Have an account?
						<span>
							<Link
								to="/register"
								className=" text-blue-600 ml-2 hover:text-blue-400 transition-all"
							>
								Register
							</Link>
						</span>
					</h3>
				</div>
			</form>
		</div>
	);
};

export default Login;
