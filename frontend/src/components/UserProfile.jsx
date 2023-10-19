import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateUser } from "../redux/user/userSlice";

import { MdEdit } from "react-icons/md";

const UserProfile = () => {
	const [isUserProfileClicked, setIsUserProfileClicked] = useState(false);
	const user = useSelector((store) => store?.userSlice?.user);
	const dispatch = useDispatch();
	// yup Schema
	const formSchema = Yup.object().shape({
		firstName: Yup.string()
			.required("First Name is Required.")
			.min(2, "First Name is Too Short."),
		lastName: Yup.string()
			.required("Last Name is Required.")
			.min(2, "Last Name is Too Short."),
		profession: Yup.string().min(3, "profession is Too Short."),
		location: Yup.string().min(3, "location is Too Short."),
	});

	const formik = useFormik({
		initialValues: {
			firstName: user?.firstName,
			lastName: user?.lastName,
			profession: user?.profession,
			location: user?.location,
		},

		onSubmit: (values) => {
			const user = {
				firstName: values.firstName,
				lastName: values.lastName,
				location: values.location || "None",
				profession: values.profession || "none",
			};
			dispatch(updateUser(user));
		},
		validationSchema: formSchema,
	});
	return (
		<form
			onSubmit={formik.handleSubmit}
			className=" relative flex flex-col gap-2 items-center mt-4 transition-all "
		>
			{isUserProfileClicked ? (
				<div className="flex gap-2 flex-col transition-all">
					<div className=" relative">
						<input
							className=" text-center px-1 py-1 outline-none focus:border-b-blue-800 border border-blue-400 rounded-md"
							value={formik.values.firstName}
							onChange={formik.handleChange("firstName")}
							onBlur={formik.handleBlur("firstName")}
							type="text"
							placeholder="firstName"
						/>
						<p className="  bottom-[-0.5rem] text-red-400">
							{formik.touched.firstName && formik.errors.firstName}
						</p>
					</div>
					<div className=" relative">
						<input
							className=" text-center px-1 py-1 outline-none focus:border-b-blue-800 border border-blue-400 rounded-md"
							value={formik.values.lastName}
							onChange={formik.handleChange("lastName")}
							onBlur={formik.handleBlur("lastName")}
							type="text"
							// placeholder="lastName"
						/>
						<p className="  bottom-[-0.5rem] text-red-400">
							{formik.touched.lastName && formik.errors.lastName}
						</p>
					</div>
					<div className=" relative">
						<input
							className=" text-center px-1 py-1 outline-none focus:border-b-blue-800 border border-blue-400 rounded-md"
							value={formik.values.profession}
							onChange={formik.handleChange("profession")}
							onBlur={formik.handleBlur("profession")}
							type="text"
						/>
						<p className=" bottom-0 text-red-400">
							{formik.touched.profession && formik.errors.profession}
						</p>
					</div>

					<div className=" relative">
						<input
							className=" text-center px-1 py-1 outline-none focus:border-b-blue-800 border border-blue-400 rounded-md"
							value={formik.values.location}
							onChange={formik.handleChange("location")}
							onBlur={formik.handleBlur("location")}
							type="text"
							placeholder="location"
						/>
						<p className="  bottom-0 text-red-400">
							{formik.touched.location && formik.errors.location}
						</p>
					</div>
				</div>
			) : (
				<div className="transition-all">
					<h1 className=" font-bold text-xs md:text-lg">{`${user?.firstName} ${user?.lastName}`}</h1>
					<h3 className=" font-bold text-gray-500 text-xs">{`Profession : ${user?.profession}`}</h3>
					<h3 className="font-bold text-gray-500 text-xs">{`Location : ${user?.location}`}</h3>
				</div>
			)}

			<button
				onClick={() => setIsUserProfileClicked(!isUserProfileClicked)}
				type="submit"
				className="absolute top-0 right-3 flex items-center text-sm transition-all "
			>
				<MdEdit className=" text-blue-500" />
				<h3 className="font-bold text-gray-600 hover:text-gray-900 text-xs">
					{isUserProfileClicked ? <p>Save</p> : <p>Edit</p>}
				</h3>
			</button>
		</form>
	);
};

export default UserProfile;
