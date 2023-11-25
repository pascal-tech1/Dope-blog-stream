import React from "react";
import { sendForgotPasswordEmail } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdCancel } from "react-icons/md";

const ForgotPassword = ({ setIsOpen }) => {
	const dispatch = useDispatch();

	const formSchema = Yup.object().shape({
		email: Yup.string().email().required("Email is Required."),
	});

	const formik = useFormik({
		initialValues: {
			email: "",
		},
		validationSchema: formSchema,
		onSubmit: (values) => {
			console.log(values);
			dispatch(sendForgotPasswordEmail(values));
		},
	});
	return (
		<div className=" w-[90vw] h-[90vh] lg:w-[60vw] bg-white flex gap-4  items-center justify-center flex-col rounded-s-lg px-4 relative rounded-lg">

			<div
				onClick={() => setIsOpen(false)}
				className=" absolute top-1 right-2"
			>
				<MdCancel className=" cursor-pointer text-3xl text-red-400 drop-shadow-md hover:drop-shadow-none transition-all delay-75" />
			</div>
			<form
				onSubmit={formik.handleSubmit}
				className=" md:max-w-[40vw] gap-4 flex flex-col "
			>
				<h1 className=" mt-4">
					Forgotten your password? No problem! enter your email belows to
					get back into your account:
				</h1>
				<label htmlFor="email">Email</label>
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
				<button
					type="submit"
					className="mt-4  bg-blue-600 px-2 rounded-md hover:bg-blue-800 transition-all delay-75  text-white  "
				>
					submit
				</button>
			</form>
		</div>
	);
};

export default ForgotPassword;