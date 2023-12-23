import React, { useState, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules } from "../../utils/quil";
import { useDispatch, useSelector } from "react-redux";

import ImageUploader from "quill-image-uploader";
import BlotFormatter from "quill-blot-formatter/dist/BlotFormatter";
import "quill-image-uploader/dist/quill.imageUploader.min.css";

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
import DashboardCustomDropdown from "../../components/DashboardCustomDropdown";
import { fetchAllCategorys } from "../../redux/category/categorySlice";
import { toast } from "react-toastify";
import {
	logOutUser,
	setIsSearchBArNeeded,
} from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

Quill.register("modules/imageUploader", ImageUploader);
Quill.register("modules/blotFormatter", BlotFormatter);

const CreatePost = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { allCategory } = useSelector((store) => store.categorySlice);
	const [quillIsFocus, setQuillIsFocus] = useState(false);
	const [postImage, setPostImage] = useState(null);
	const [selectedFilter, setSelectedFilter] = useState("general");
	const { isBlocked } = useSelector((store) => store.singlePostSlice);
	const { user } = useSelector((store) => store.userSlice);
	const _id = user?._id;
	const wordsPerMinute = 200;
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
	useEffect(() => {
		if (isBlocked) {
			dispatch(logOutUser());
			navigate("/");
		}
	}, [isBlocked]);

	useEffect(() => {
		dispatch(setIsSearchBArNeeded(false));
	}, []);

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
					image: null,
					content,
				},
			});
			dispatch(clearSinglesliceState());
			setSelectedFilter("General");
		}
	}, [postEditingStatus]);
	useEffect(() => {
		if (!_id) return;
		dispatch(fetchAllCategorys());
		isEditing && setSelectedFilter(postToBeEdited?.category);
	}, [_id]);

	const allCategorytitle = allCategory.map((category) => category.title);

	const formik = useFormik({
		initialValues: {
			title: (isEditing && postToBeEdited?.title) || title,
			description:
				(isEditing && postToBeEdited?.description) || description,
			category: (isEditing && postToBeEdited?.category) || category,
			image: null,
			content: (isEditing && postToBeEdited?.content) || content,
			readingTime: null,
		},

		onSubmit: (values) => {
			// if (values.content.length <= 100) {
			// 	toast.error(
			// 		"content is required and cannot be less than 100 characters"
			// 	);
			// 	return;
			// }
			const tempElement = document.createElement("div");
			tempElement.innerHTML = values.content;

			// Get the innerText of the temporary element
			const wordCount = tempElement.innerText.split(" ").length;
			console.log(wordCount);
			const readingTime = Math.ceil(wordCount / wordsPerMinute);
			console.log(readingTime);
			values.category = selectedFilter;
			values.readingTime = readingTime;

			isEditing
				? dispatch(updatePost(values))
				: dispatch(createPost(values));
		},

		validationSchema: isEditing ? isEditingFormSchema : formSchema,
	});

	if (status === "loading") {
		return (
			<div className="flex justify-center items-center">
				<Spinner />
			</div>
		);
	}

	const handleQuilFocus = () => {
		setQuillIsFocus(true);
	};
	const handleOnBlur = () => {
		setQuillIsFocus(false);
	};

	return (
		<div
			className={`${
				quillIsFocus && ""
			}font-inter font-medium  gap-7 pb-6  relative dark:bg-dark p-4 rounded-md  `}
		>
			<form onSubmit={formik.handleSubmit} className=" ">
				<div
					className={`flex flex-col gap-4 ${
						quillIsFocus && " absolute -top-[15rem]"
					}`}
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
							className=" col-start-2 col-span-full  w-full px-2 rounded-lg py-2 outline-none border dark:border-gray-800 dark:focus:border-gray-600 border-blue-300 focus:border-blue-800  dark:bg-lightdark "
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

						<div className=" ">
							<DashboardCustomDropdown
								allFilters={allCategorytitle}
								setSelectedFilter={setSelectedFilter}
								selectedFilter={selectedFilter}
								dropdownWidth={"w-[50vw]"}
							/>
						</div>
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
							className=" col-start-2 col-span-full w-full rounded-lg px-2 py-2 outline-none border dark:border-gray-800 dark:focus:border-gray-600 dark:bg-lightdark  border-blue-300 focus:border-blue-800"
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
							<h1 className="bg-blue-400 dark:bg-colorPrimary py-2 rounded-md px-3">
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

				<div className=" mb-6 relative">
					<div className=" flex gap-2 items-center justify-center absolute -top-4 right-0 ">
						<button
							type="submit"
							className={`self-start border border-blue-400  py-1 px-2 dark:border-gray-800 dark:focus:border-gray-600 hover:bg-blue-400 transition-all hover:text-white ${
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

					<div
						className={`my-6 ${
							quillIsFocus
								? "  h-[85vh]  relative top-0  z-50"
								: "h-[40vh]"
						}`}
					>
						<ReactQuill
							theme="snow"
							modules={modules}
							value={formik.values.content}
							onChange={formik.handleChange("content")}
							className="h-full py-6"
							onFocus={handleQuilFocus}
							onBlur={handleOnBlur}
							// formats={formats}
						/>
					</div>
				</div>
			</form>
		</div>
	);
};

export default CreatePost;
