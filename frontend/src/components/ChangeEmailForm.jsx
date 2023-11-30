import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { setChangeEmail } from "../redux/user/userSlice";
import { changeEmail } from "../redux/user/userSlice";

const ChangeEmailForm = () => {
	const dispatch = useDispatch();
	const { changeEmailStatus } = useSelector((store) => store.userSlice);

	const formSchema = Yup.object().shape({
		email: Yup.string().email().required("Email is Required."),
		password: Yup.string()
			.required("No password provided.")
			.min(8, "Password is too short - should be 8 chars minimum."),
		newEmail: Yup.string().email().required("New Email is Required."),
	});

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
			newEmail: "",
		},

		onSubmit: (values) => {
			console.log(values);
			dispatch(changeEmail(values));
		},
		validationSchema: formSchema,
	});
	const handleclose = () => {
		dispatch(setChangeEmail());
	};

	return (
		<Modal
			isOpen={changeEmailStatus}
			onClose={handleclose}
			onContinue={formik.handleSubmit}
		>
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
			<label className=" form-label  " htmlFor="email">
				New Email
			</label>
			<input
				aria-label="Enter your email"
				type="email"
				className=" form-input"
				value={formik.values.newEmail}
				onChange={formik.handleChange("newEmail")}
				onBlur={formik.handleBlur("newEmail")}
			/>
			<div className=" relative mb-2 self-start">
				<h1 className=" form-error-text">
					{formik.touched.newEmail && formik.errors.newEmail}
				</h1>
			</div>
		</Modal>
	);
};

export default ChangeEmailForm;
