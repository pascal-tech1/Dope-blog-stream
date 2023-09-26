import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules } from "../../utils/quil";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../redux/post/postSlice";
import { LoadingSpinner } from "../../utils/Spinner";

const Post = () => {
	const [richText, setRichText] = useState("");
	const [postImage, setPostImage] = useState();
	const dispatch = useDispatch();
	const url = postImage ? URL.createObjectURL(postImage) : "";
	const { isLoading } = useSelector(
		(store) => store.allPostSlice
	);
	console.log(isLoading)
	const handlePostImage = (e) => {
		e.preventDefault();
		setPostImage(e.target.files[0]);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const title = e?.target[0].value;
		const category = e?.target[1].value;
		const description = e?.target[2].value;
		const newFormData = new FormData();
		newFormData.append("image", postImage);
		newFormData.append("title", title);
		newFormData.append("category", category);
		newFormData.append("content", richText);
		newFormData.append("description", description);

		dispatch(createPost(newFormData));
	};

	return (
		<div className=" font-inter font-medium mt-16  gap-7 px-10">
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 h-max mb-8 "
			>
				<div className="grid grid-cols-3 items-center w-11/12 lg:w-3/6 ">
					<label className=" col-start-1 col-span-1" htmlFor="title">
						Title
					</label>
					<input
						type="text"
						name="title"
						id="title"
						className=" col-start-2 col-span-full  w-full px-2 rounded-lg py-2 outline-none border border-blue-300 focus:border-blue-800 "
					/>
				</div>
				<div className="grid grid-cols-3 items-center  w-11/12 lg:w-3/6 ">
					<label className=" col-start-1 col-span-1" htmlFor="category">
						Category
					</label>
					<input
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
						type="text"
						name="description"
						id="description"
						className=" col-start-2 col-span-full w-full rounded-lg px-2 py-2 outline-none border border-blue-300 focus:border-blue-800"
					/>
				</div>

				<div className=" flex gap-4 items-center">
					<label className=" flex items-center self-start relative border border-dashed p-3 rounded-sm  cursor-pointer text-white">
						<input
							type="file"
							name="image"
							id="image"
							accept=".jpg, .png, .jpeg"
							onChange={handlePostImage}
							className=" hidden z-50"
						/>
						<h1 className="bg-blue-400 py-2 rounded-md px-3">
							Upload Image
						</h1>
					</label>
					{url && (
						<div className="  ">
							<img src={url} alt="" className=" h-16 w-16 rounded-md" />
						</div>
					)}
				</div>

				<div className="">
					<ReactQuill
						theme="snow"
						modules={modules}
						value={richText}
						onChange={setRichText}
						className=" w-full h-[10rem] md:h-[30rem] lg:h-[20rem] "
					/>
				</div>

				<button
					type="submit"
					className={`self-start mt-[10rem] md:mt-[6rem] border border-blue-400  py-1 px-10 hover:bg-blue-400 transition-all hover:text-white ${isLoading && "bg-blue-400"} rounded-md`}
				>
					{isLoading ? <LoadingSpinner text="loading" /> : 'Submit'}
				</button>
			</form>
			{/* <img src={url} alt="" /> */}
		</div>
	);
};

export default Post;
