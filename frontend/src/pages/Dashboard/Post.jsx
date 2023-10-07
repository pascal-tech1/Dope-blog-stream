import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules } from "../../utils/quil";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../redux/post/singlePostSlice";
import { LoadingSpinner } from "../../utils/Spinner";
import { useFormik } from "formik";

import * as Yup from "yup";
import { Spinner } from "../../components";

const Post = () => {
	const dispatch = useDispatch();
	const { post, status, isEditing, isLoading } = useSelector(
		(store) => store.singlePostSlice
	);

	const [postImage, setPostImage] = useState(null);
	const url = postImage ? URL.createObjectURL(postImage) : post?.image;

	const formSchema = Yup.object().shape({
		title: Yup.string()
			.required("Title is required.")
			.min(3, "title is too short - should be 3 minimum"),
		description: Yup.string()
			.required("Description is required.")
			.min(100, "Description is too short - should be 50 minimum"),

		image: Yup.mixed()
			.required("Image is required")
			.test(
				"fileSize",
				"File size too large",
				(value) => value && value.size <= 1024000
			), // Adjust the file size limit as needed,
	});

	const formik = useFormik({
		initialValues: {
			title: (isEditing && post?.title) || "",
			description: (isEditing && post?.description) || "",
			category: (isEditing && post?.category) || "",
			image: null,
			content:
				(isEditing && post?.content) ||
				"Enter your post content here, Creativity is your limit",
		},

		onSubmit: (values, { resetForm }) => {
			isEditing
				? dispatch(updatePost(values))
				: dispatch(createPost(values));
			formik.resetForm();
		},
		validationSchema: formSchema,
	});
	if (status === "loading") {
		return (
			<div className="flex justify-center items-center mt-8">
				<Spinner />
			</div>
		);
	}
	return (
		<div className=" font-inter font-medium mt-16  gap-7 px-10">
			<form
				onSubmit={formik.handleSubmit}
				className="flex flex-col gap-4 h-max mb-8 "
			>
				<div className="grid grid-cols-3 items-center w-11/12 lg:w-3/6 relative ">
					<label className=" col-start-1 col-span-1" htmlFor="title">
						Title
					</label>
					<input
						value={formik.values.title}
						onChange={formik.handleChange("title")}
						onBlur={formik.handleBlur("title")}
						type="text"
						name="title"
						id="title"
						className=" col-start-2 col-span-full  w-full px-2 rounded-lg py-2 outline-none border border-blue-300 focus:border-blue-800 "
					/>
					<div className=" relative mb-2 place-self-end">
						<h1 className=" form-error-text">
							{formik.touched.title && formik.errors.title}
						</h1>
					</div>
				</div>
				<div className="grid grid-cols-3 items-center  w-11/12 lg:w-3/6 ">
					<label className=" col-start-1 col-span-1" htmlFor="category">
						Category
					</label>
					<input
						value={formik.values.category}
						onChange={formik.handleChange("category")}
						onBlur={formik.handleBlur("category")}
						type="text"
						name="category"
						id="category"
						className=" col-start-2 col-span-full w-full rounded-lg px-2 py-2 outline-none border border-blue-300 focus:border-blue-800"
					/>
				</div>
				<div className="grid grid-cols-3 items-center  w-11/12 lg:w-3/6 ">
					<label className=" col-start-1 col-span-1" htmlFor="description">
						Description
					</label>
					<input
						value={formik.values.description}
						onChange={formik.handleChange("description")}
						onBlur={formik.handleBlur("description")}
						type="text"
						name="description"
						id="description"
						className=" col-start-2 col-span-full w-full rounded-lg px-2 py-2 outline-none border border-blue-300 focus:border-blue-800"
					/>
					<div className=" relative mb-2 place-self-end">
						<h1 className=" form-error-text">
							{formik.touched.description && formik.errors.description}
						</h1>
					</div>
				</div>
				<div className=" flex gap-4 items-center">
					<label className=" flex items-center self-start relative border border-dashed p-3 rounded-sm  cursor-pointer text-white">
						<input
							type="file"
							name="image"
							id="image"
							accept=".jpg, .png, .jpeg"
							onBlur={formik.handleBlur("image")}
							onChange={(event) => {
								formik.setFieldValue(
									"image",
									event.currentTarget.files[0]
								);
								setPostImage(event.currentTarget.files[0]);
							}}
							className=" hidden z-50"
						/>
						<h1 className="bg-blue-400 py-2 rounded-md px-3">
							Upload Image
						</h1>
					</label>
					<div className=" relative mb-2 ">
						<h1 className=" form-error-text">
							{formik.touched.image && formik.errors.image}
						</h1>
					</div>
					{url && (
						<div className="  ">
							<img src={url} alt="" className=" h-16 w-16 rounded-md" />
						</div>
					)}
				</div>

				<div className=" relative">
					<ReactQuill
						theme="snow"
						modules={modules}
						value={formik.values.content}
						onChange={formik.handleChange("content")}
						className=" w-full h-[13rem] md:h-[30rem] lg:h-[20rem] "
					/>

					<div className=" flex gap-2  mt-[9rem] md:mt-[6rem] items-center justify-center ">
						<button
							type="submit"
							className={`self-start border border-blue-400  py-1 px-2 hover:bg-blue-400 transition-all hover:text-white ${
								isLoading && "bg-blue-400"
							} rounded-md`}
						>
							{isLoading ? (
								<LoadingSpinner text="loading" />
							) : (
								<h3>{isEditing ? "Update Post" : "Create Post"}</h3>
							)}
						</button>
					</div>
				</div>
			</form>
			{/* <img src={url} alt="" /> */}
		</div>
	);
};

export default Post;
