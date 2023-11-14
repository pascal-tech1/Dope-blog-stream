import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules } from "../../utils/quil";
import { useDispatch, useSelector } from "react-redux";
import {
	clearSinglesliceState,
	createPost,
	updatePost,
} from "../../redux/post/singlePostSlice";
import { useFormik } from "formik";

import { Spinner } from "../../components";
import {
	formSchema,
	isEditingFormSchema,
} from "../../utils/createPostYup";

const CreatePost = () => {
	const dispatch = useDispatch();
	const {
		status,
		isEditing,
		postEditingStatus,
		postToBeEdited,
		title,
		description,
		content,
		category,
	} = useSelector((store) => store.singlePostSlice);

	const [postImage, setPostImage] = useState(null);

	const url = postImage
		? URL.createObjectURL(postImage)
		: isEditing && postToBeEdited?.image;

	useEffect(() => {
		if (postEditingStatus === "success") {
			setPostImage(null);
			formik.resetForm({
				values: {
					title,
					description,
					category,
					image: null,
					content,
				},
			});
			dispatch(clearSinglesliceState());
		}
	}, [postEditingStatus]);

	const formik = useFormik({
		initialValues: {
			title: (isEditing && postToBeEdited?.title) || title,
			description:
				(isEditing && postToBeEdited?.description) || description,
			category: (isEditing && postToBeEdited?.category) || category,
			image: null,
			content: (isEditing && postToBeEdited?.content) || content,
		},

		onSubmit: (values) => {
			isEditing
				? dispatch(updatePost(values))
				: dispatch(createPost(values));
		},
		validationSchema: isEditing ? isEditingFormSchema : formSchema,
	});

	if (status === "loading") {
		return (
			<div className="flex justify-center items-center mt-8">
				<Spinner />
			</div>
		);
	}
formik.handleChangez
	return (
		<div className=" font-inter font-medium mt-16  gap-7 px-10 relative ">
			<form onSubmit={formik.handleSubmit} className=" ">
				<div className="flex flex-col gap-4">
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
						<label
							className=" col-start-1 col-span-1"
							htmlFor="description"
						>
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
				</div>

				<div className=" mt-3">
					<div>
						<ReactQuill
							theme="snow"
							modules={modules}
							value={formik.values.content}
							onChange={formik.handleChange("content")}
							className=" h-screen top-0 "
						/>
					</div>

					<div className=" flex gap-2  mt-[9rem] md:mt-[6rem] items-center justify-center ">
						<button
							type="submit"
							className={`self-start border border-blue-400  py-1 px-2 hover:bg-blue-400 transition-all hover:text-white ${
								postEditingStatus === "loading" && "bg-blue-400"
							} rounded-md`}
						>
							{postEditingStatus === "loading" ? (
								<Spinner />
							) : (
								<h3>{isEditing ? "Update Post" : "Create Post"}</h3>
							)}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default CreatePost;
