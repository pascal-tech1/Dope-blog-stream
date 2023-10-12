import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LikesSaveViews from "./LikesSaveViews";
import PostUserInfo from "./PostUserInfo";

const PostInfo = ({ post }) => {
	const user = useSelector((store) => store?.userSlice?.user);
	return (
		<div className="flex flex-col mt-3 mb-2 justify-self-center">
			{/* user who created the post  */}
			<PostUserInfo post={post} />

			<div className="flex  flex-col md:flex-row justify-centers gap-4 mt-3">
				<div className=" self-start">
					<Link to={`/single-post/${post?._id}`}>
						<h3 className=" font-semibold text-lg mb-2 ">{post?.title}</h3>
					</Link>
					<div className=" text-xs flex ">
						<p>
							{post?.description}

							<Link
								to={`/single-post/${post?._id}`}
								className="ml-1 text-blue-300 hover:text-blue-400 transition-all cursor-pointer"
							>
								Read more
							</Link>
						</p>
					</div>
					<div className="text-md md:text-sm ">
						<LikesSaveViews post={post} />
					</div>
				</div>
				<Link
					to={`/single-post/${post?._id}`}
					className=" self-center md:self-start "
				>
					<img
						className=" max-w-xs w-52  md:w-40  rounded-md"
						src={post?.image}
						alt=""
					/>
				</Link>
			</div>
		</div>
	);
};

export default PostInfo;