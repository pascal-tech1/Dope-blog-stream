import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followOrUnfollowUser } from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import {
	fetchPostToBeEdited,
	setIsEditingPost,
} from "../redux/post/singlePostSlice";
import { Spinner } from "../components/index";

export const FollowingBtn = ({ userToFollowOrUnfollow, className }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const user = useSelector((store) => store?.userSlice?.user);

	const handleFollowUser = () => {
		if (!user) {
			navigate("/login");
			return;
		}
		dispatch(followOrUnfollowUser(userToFollowOrUnfollow?._id));
	};

	className = className
		? className
		: `  self-center hover:bg-blue-800 text-center py-[0.2rem] px-2 bg-blue-900 text-white hover:text-white  transition-all delay-75`;

	return (
		<button onClick={handleFollowUser} className={className}>
			{user?.following?.includes(userToFollowOrUnfollow?._id) ? (
				<h3>following</h3>
			) : (
				<h3>follow</h3>
			)}
		</button>
	);
};

export const EditPostBtn = ({ postId }) => {
	const { postEditingFetchingStatus } = useSelector(
		(store) => store.singlePostSlice
	);
	const [clickId, setClickId] = useState();

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleEditPost = async () => {
		dispatch(setIsEditingPost(true));
		setClickId(postId);
		const isPostFetch = await dispatch(fetchPostToBeEdited(postId));
		if (isPostFetch) {
			navigate("/post-Create");
		}
	};
	return (
		<div>
			<button
				onClick={handleEditPost}
				className="border self-center px-1 hover:bg-blue-400 text-center py-[0.1rem] hover:text-white rounded-md transition-all delay-75 border-blue-400 "
			>
				{postEditingFetchingStatus === "loading" && clickId === postId ? (
					<Spinner className="h-[1.2rem] w-[1.2rem] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
				) : (
					"Edit"
				)}
			</button>
		</div>
	);
};
