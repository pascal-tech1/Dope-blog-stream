import React from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";

import { useDispatch } from "react-redux";
import { formatDate } from "../utils/dataFormatter";
import { likeOrDislikePost } from "../redux/post/generalPostSlice";

import { MdOutlineBookmarkAdd } from "react-icons/md";
import { savePost } from "../redux/user/userSlice";

const CategoryandLikes = ({ post }) => {
	const dispatch = useDispatch();
	const handleLikes = (id) => {
		dispatch(likeOrDislikePost({ choice: "like", postId: id }));
	};
	const handleDislikes = (id) => {
		dispatch(likeOrDislikePost({ choice: "disLike", postId: id }));
	};
	return (
		<div className=" text-sm flex gap-2 items-center mt-3 font-light flex-wrap justify-start  ">
			<h3 className=" ">{formatDate(post?.createdAt)}</h3>
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
			<button onClick={() => dispatch(savePost(post?._id))}>
				<MdOutlineBookmarkAdd />
			</button>
			<h3 className="whitespace-nowrap  text-sm delay-75 cursor-pointer flex  bg-gray-200 hover:bg-gray-200 rounded-xl  py-[0.35rem] px-4">
				{post?.category}
			</h3>
		</div>
	);
};

export default CategoryandLikes;
