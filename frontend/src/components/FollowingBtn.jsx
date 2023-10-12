import React, { useEffect } from "react";
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
		: ` border self-center hover:bg-blue-800 text-center py-[0.2rem] px-2 bg-blue-900 text-white hover:text-white rounded-lg transition-all delay-75`;

	return (
		<button onClick={handleFollowUser} className={className}>
			{user?.following?.includes(userToFollowOrUnfollow?._id) ? (
				<h3>unfollow</h3>
			) : (
				<h3>follow</h3>
			)}
		</button>
	);
};

export const EditPostBtn = ({ postId }) => {
	const { postEditingStatus } = useSelector(
		(store) => store.singlePostSlice
	);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleEditPost = async () => {
		dispatch(setIsEditingPost(true));
		const isPostFetch = await dispatch(fetchPostToBeEdited(postId));
		if (isPostFetch) {
			navigate("/dashboard/post");
		}
	};
	return (
		<button
			onClick={handleEditPost}
			className="border self-center px-1 hover:bg-blue-400 text-center py-[0.1rem] hover:text-white rounded-md transition-all delay-75 border-blue-400 "
		>
			<h3>
				{postEditingStatus === "loading" ? (
					<Spinner
						className={
							"w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
						}
					/>
				) : (
					"Edit Post"
				)}
			</h3>
		</button>
	);
};