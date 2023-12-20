import React from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";

import { useDispatch } from "react-redux";

import { likeOrDislikePost } from "../redux/post/generalPostSlice";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { savePost } from "../redux/user/userSlice";

import { Link } from "react-router-dom";
import {
	fetchPostByCategory,
	setActiveCategory,
	setFetchFirstCategory,
} from "../redux/post/allPostSlice";

const LikesSaveViews = ({ post }) => {
	const dispatch = useDispatch();
	const handleLikes = (id) => {
		dispatch(likeOrDislikePost({ choice: "like", postId: id }));
	};
	const handleDislikes = (id) => {
		dispatch(likeOrDislikePost({ choice: "disLike", postId: id }));
	};
	return (
		<div className=" md:text-sm flex gap-2 font-inter items-center text-sm dark:text-slate-300 flex-wrap justify-start  ">
			<span className="flex gap-1 items-center">
				<button
					onClick={() => handleLikes(post?._id)}
					className=" hover:cursor-pointer  px-1 py-1 transition-all delay-75 hover:bg-gray-400 rounded-md hover:text-white"
				>
					<AiOutlineLike className="" />
				</button>
				<span>{post?.likes?.length}</span>
			</span>
			<span className="flex gap-1 items-center">
				<button
					onClick={() => handleDislikes(post?._id)}
					className=" hover:cursor-pointer  px-1 py-1 transition-all delay-75 hover:bg-gray-400 rounded-md hover:text-white"
				>
					<AiOutlineDislike className="" />
				</button>
				<span>{post?.disLikes?.length}</span>
			</span>

			<h3 className="flex gap-1 items-center flex-nowrap">
				<span className="  ">{post?.numViews}</span>
				{post?.numViews > 1 ? "views" : "view"}
			</h3>
			<button
				onClick={() => dispatch(savePost(post?._id))}
				className=" hover:bg-gray-400 p-1 rounded-full hover:text-white"
			>
				<MdOutlineBookmarkAdd />
			</button>
			<Link
				to={"/"}
				onClick={(e) => {
					dispatch(setActiveCategory(post?.category));
					dispatch(setFetchFirstCategory(post?.category));
					dispatch(fetchPostByCategory());
				}}
				className="whitespace-nowrap gap-2 mt-1 text-sm delay-75 cursor-pointer flex bg-gray-200 hover:bg-gray-300 rounded-md dark:text-slate-300 dark:bg-[#1C1C1C] hover:dark:bg-gray-700 py-[0.1rem] px-4"
			>
				{post?.category?.charAt(0).toUpperCase() +
					post?.category?.slice(1).toLowerCase()}
			</Link>
		</div>
	);
};

export default LikesSaveViews;
