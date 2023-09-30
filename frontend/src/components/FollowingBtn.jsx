import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followOrUnfollowUser } from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import {
	fetchSinglePost,
	setIsEditingPost,
	setSinglePostStatus,
} from "../redux/post/singlePostSlice";
import Spinner from "./spinner";
import { LoadingSpinner } from "../utils/Spinner";

export const FollowingBtn = ({ userToFollowOrUnfollow }) => {
	const user = useSelector((store) => store?.userSlice?.user?.user);
	const dispatch = useDispatch();
	const handleFollowUser = () => {
		dispatch(followOrUnfollowUser(userToFollowOrUnfollow?._id));
	};

	return (
		<button
			onClick={handleFollowUser}
			className=" border self-center hover:bg-blue-800 text-center py-[0.1rem] bg-blue-900 text-white hover:text-white rounded-md transition-all delay-75  px-1"
		>
			{user.following.includes(userToFollowOrUnfollow?._id) ? (
				<h3>unfollow</h3>
			) : (
				<h3>follow</h3>
			)}
		</button>
	);
};

export const EditPostBtn = ({ postId }) => {
	const { post, status, isEditing } = useSelector(
		(store) => store.singlePostSlice
	);
	useEffect(() => {
		if (status === "success" && isEditing) navigate("/dashboard/post");
		return () => {
			dispatch(setSinglePostStatus("idle"));
		};
	}, [status]);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleEditPost = () => {
		dispatch(setIsEditingPost(true));
		if (post?.id === postId) {
			navigate("/dashboard/post");
		} else {
			dispatch(fetchSinglePost(postId));
		}
	};
	return (
		<button
			onClick={handleEditPost}
			className="border self-center px-1 hover:bg-blue-400 text-center py-[0.1rem] hover:text-white rounded-md transition-all delay-75 border-blue-400 "
		>
			{status === "loading" ? <LoadingSpinner /> : <h3>Edit Post</h3>}
		</button>
	);
};
