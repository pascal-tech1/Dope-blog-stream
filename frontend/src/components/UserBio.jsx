import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateUser } from "../redux/user/userSlice";
import { MdEdit } from "react-icons/md";

const UserBio = () => {
	const [isUserProfileClicked, setIsUserProfileClicked] = useState(false);
	const user = useSelector((store) => store?.userSlice?.user);
	const dispatch = useDispatch();
	// yup Schema
	const formSchema = Yup.object().shape({
		bio: Yup.string()
			.min(10, "bio must not be less than 10 characters")
			.max(600, "bio must be less than 600 characters"),
	});

	const formik = useFormik({
		initialValues: {
			bio: user?.bio,
		},

		onSubmit: (values) => {
			setIsUserProfileClicked(!isUserProfileClicked);
			if (!isUserProfileClicked) return;

			const user = {
				bio: values.bio,
			};
			dispatch(updateUser(user));
		},
		validationSchema: formSchema,
	});
	return (
		<form
			onSubmit={formik.handleSubmit}
			className="  rounded-xl flex flex-col px-4 mt-4 mb-4"
		>
			<div className=" flex justify-between mr-4 mt-4">
				<h1 className=" font-bold text-gray-900 ">Summary</h1>
				<button type="submit" className="flex gap-1">
					<MdEdit className=" text-blue-500" />
					<h3 className="font-bold text-gray-600 hover:text-gray-900 text-xs">
						{isUserProfileClicked ? "save" : "Edit"}
					</h3>
				</button>
			</div>
			{isUserProfileClicked ? (
				<textarea
					value={formik.values.bio}
					onChange={formik.handleChange("bio")}
					onBlur={formik.handleBlur("bio")}
					name="summary"
					id="summary"
					cols="30"
					rows="5"
					className=" border rounded-lg border-blue-400 outline-none focus:border-blue-800 px-2 py-2 mt-2"
				></textarea>
			) : (
				<p className=" text-sm">{user?.bio}</p>
			)}
			<div className=" text-red-500">
				{formik.touched.bio && formik.errors.bio}
			</div>
		</form>
	);
};

export default UserBio;
