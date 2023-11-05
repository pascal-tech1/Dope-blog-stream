import React from "react";
import { formatDate } from "../utils/dataFormatter";
import { Link } from "react-router-dom";
import { EditPostBtn, FollowingBtn } from "./FollowingBtn";
import { useSelector } from "react-redux";

const PostUserInfo = ({ post }) => {
	const loginUser = useSelector((store) => store.userSlice.user);

	const user = post?.user;

	return (
		<>
			{user?.firstName && (
				<div className="flex text-xs gap-3 text-gray-400 ">
					<Link to={loginUser?._id ? `/profile/${user._id}` : `/login`} className="flex gap-2">
						<img
							src={post?.user?.profilePhoto}
							alt=""
							className="w-8 h-8 rounded-full "
						/>

						<div>
							<h3 className=" text-xs">{formatDate(post?.createdAt)}</h3>
							<h3 className=" text-xs">{` ${post?.user?.firstName} ${post?.user?.lastName}  `}</h3>
						</div>
					</Link>
					{/* if its not the user that created the post render the follow button else render theedit button */}
					{loginUser?._id !== post?.user?._id ? (
						<FollowingBtn
							userToFollowOrUnfollow={post?.user}
							className=" border self-center py-[0.2rem] text-blue-600 px-2 rounded-lg hover:bg-blue-400 hover:text-white transition-all delay-75 "
						/>
					) : (
						<EditPostBtn post={post} postId={post?._id} />
					)}
				</div>
			)}
		</>
	);
};

export default PostUserInfo;
