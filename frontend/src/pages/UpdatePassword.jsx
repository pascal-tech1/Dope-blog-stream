import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { NavBar, Spinner } from "../components";
import { useFormik } from "formik";
import * as Yup from "yup";

import { BsEye, BsEyeSlash } from "react-icons/bs";
import { updatePassword } from "../redux/user/userSlice";

const UpdatePassword = () => {
	const dispatch = useDispatch();
	const { updatePasswordStatus } = useSelector((store) => store.userSlice);

	const [showPassword, setShowPassword] = useState({
		oldPassword: false,
		password: false,
		confirmPassword: false,
	});

	const togglePasswordVisibility = (field) => {
		setShowPassword((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const formSchema = Yup.object().shape({
		oldPassword: Yup.string()
			.required("Old Password is required")
			.min(6, "Password must be at least 6 characters"),

		password: Yup.string()
			.required("Password is required")
			.min(6, "Password must be at least 6 characters"),

		confirmPassword: Yup.string()
			.oneOf([Yup.ref("password"), null], "Passwords must match")
			.required("Confirm Password is required"),
	});

	const formik = useFormik({
		initialValues: {
			password: "",
			confirmPassword: "",
			oldPassword: "",
		},
		validationSchema: formSchema,
		onSubmit: (values) => {
			const user = {
				newPassword: values.password,
				oldPassword: values.oldPassword,
			};
			dispatch(updatePassword(user));
		},
	});
	useEffect(() => {
		console.log(updatePassword);
		if (updatePasswordStatus === "loading") return;
		if (updatePasswordStatus === "success") {
			console.log("im here");
			formik.resetForm({
				values: {
					password: "",
					oldPassword: "",
					confirmPassword: "",
				},
			});
		}
	}, [updatePasswordStatus]);
	return (
		<div className=" font-inter">
			<div>
				<NavBar />
			</div>
			<div className=" flex items-center justify-center h-[80vh] w-screen flex-col gap-4 px-6">
				{/* form */}
				<form
					className="flex flex-col gap-1"
					onSubmit={formik.handleSubmit}
				>
					<h1 className=" mb-3">
						fill in your old and your new password to continue to change
						your password
					</h1>
					{/* oldPassword */}
					<label className=" form-label" htmlFor="password">
						old password
					</label>
					<div className=" relative">
						<input
							type={showPassword.oldPassword ? "text" : "password"}
							className="form-input "
							value={formik.values.oldPassword}
							onChange={formik.handleChange("oldPassword")}
							onBlur={formik.handleBlur("oldPassword")}
						/>
						<span
							className=" absolute top-[30%] right-2"
							onClick={() => togglePasswordVisibility("oldPassword")}
						>
							{showPassword.oldPassword ? <BsEye /> : <BsEyeSlash />}
						</span>
						<div className=" relative mb-2 self-start">
							<h1 className=" form-error-text">
								{formik.touched.oldPassword && formik.errors.oldPassword}
							</h1>
						</div>
					</div>

					{/* new password */}
					<label className=" form-label" htmlFor="oldPassword">
						new Password
					</label>
					<div className=" relative">
						<input
							type={showPassword.password ? "text" : "password"}
							className="form-input "
							value={formik.values.password}
							onChange={formik.handleChange("password")}
							onBlur={formik.handleBlur("password")}
						/>
						<span
							className=" absolute top-[30%] right-2"
							onClick={() => togglePasswordVisibility("password")}
						>
							{showPassword.password ? <BsEye /> : <BsEyeSlash />}
						</span>
					</div>
					<div className=" relative mb-2 self-start">
						<h1 className=" form-error-text">
							{formik.touched.password && formik.errors.password}
						</h1>
					</div>

					{/* confirm Password */}
					<label className=" form-label" htmlFor="oldPassword">
						Confirm Password
					</label>
					<div className="relative">
						<input
							type={showPassword.confirmPassword ? "text" : "password"}
							className="form-input "
							value={formik.values.confirmPassword}
							onChange={formik.handleChange("confirmPassword")}
							onBlur={formik.handleBlur("confirmPassword")}
						/>
						<span
							className=" absolute top-[30%] right-2"
							onClick={() => togglePasswordVisibility("confirmPassword")}
						>
							{showPassword.confirmPassword ? <BsEye /> : <BsEyeSlash />}
						</span>
					</div>
					<div className=" relative mb-2 self-start">
						<h1 className=" form-error-text">
							{formik.touched.confirmPassword &&
								formik.errors.confirmPassword}
						</h1>
					</div>
					<button
						className=" self-center text-center bg-blue-400 mt-4 px-2 py-1 rounded-lg text-white hover:bg-blue-600 transition-all duration-75"
						type="submit"
					>
						{updatePasswordStatus === "loading" ? <Spinner /> : "Submit"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default UpdatePassword;
