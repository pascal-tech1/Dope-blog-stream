import React from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { likeOrDislikePost } from "../redux/post/postSlice";
import { useDispatch } from "react-redux";
import { formatDate } from "../utils/dataFormatter";

const CategoryandLikes = ({ post }) => {
	const dispatch = useDispatch();
	const handleLikes = (id) => {
		dispatch(likeOrDislikePost({ choice: "like", id: { postId: id } }));
	};
	const handleDislikes = (id) => {
		dispatch(likeOrDislikePost({ choice: "disLike", id: { postId: id } }));
	};
	return (
		<div className=" flex gap-2 items-center mt-3 font-light flex-wrap justify-start  ">
			<h3 className="">{formatDate(post?.createdAt)}</h3>
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
				<span>{post?.disLikes.length}</span>
			</span>

			<h3 className="flex gap-1 items-center flex-nowrap">
				<span>{post?.numViews}</span>
				{post?.numViews > 1 ? "views" : "view"}
			</h3>

			<h3 className="whitespace-nowrap  text-sm delay-75 cursor-pointer flex  bg-gray-200 hover:bg-gray-200 rounded-xl  py-[0.35rem] px-4">
				{post?.category}
			</h3>
		</div>
	);
};

export default CategoryandLikes;
