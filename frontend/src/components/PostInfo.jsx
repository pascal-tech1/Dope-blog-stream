import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LikesSaveViews from "./LikesSaveViews";
import PostUserInfo from "./PostUserInfo";
import { uptimizeCloudinaryImage } from "../utils/imageCloudinaryOptimizer";
import LazyLoadImg from "./LazyLoadImg";
//

const PostInfo = ({ post }) => {
	const user = useSelector((store) => store?.userSlice?.user);

	return (
		<div className="flex flex-col mt-3 mb-2 justify-self-center">
			{/* user who created the post  */}
			<PostUserInfo post={post} />

			<div className="flex  flex-row justify-between gap-4 mt-3">
				<div className=" self-start">
					<Link to={`/single-post/${post?._id}`}>
						<h3 className=" font-semibold text-sm  lg:text-lg mb-2 ">
							{post?.title}
						</h3>
					</Link>
					<div className=" text-xs hidden md:flex ">
						<p className=" ">
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
				<Link to={`/single-post/${post?._id}`} className=" self-start  ">
					{/* lazyloadingImg */}
					<LazyLoadImg
						backgroundClassName={
							"w-[112px] rounded-md relative"
						}
						imgClassName={
							"absolute inset-0 w-full h-full object-cover rounded-md"
						}
						originalImgUrl={post?.image}
						blurImageStr={post.blurImageUrl}
						optimizationStr={"q_auto,f_auto,w_200"}
						paddingBottom={"100%"}
					/>
				</Link>
			</div>
		</div>
	);
};

export default PostInfo;
