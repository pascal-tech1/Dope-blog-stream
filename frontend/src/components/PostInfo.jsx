import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LikesSaveViews from "./LikesSaveViews";
import PostUserInfo from "./PostUserInfo";

import LazyLoadImg from "./LazyLoadImg";
//

const PostInfo = ({ post }) => {
	const user = useSelector((store) => store?.userSlice?.user);

	return (
		<div className="flex flex-col mb-2 justify-self-center py-6 border-b dark:border-b dark:border-b-lightdark rounded-md px-3 ">
			{/* user who created the post  */}
			<div className=" self-start">
				<PostUserInfo post={post} />
			</div>

			<div className="flex flex-col  min-[350px]:flex-row  justify-between gap-4 mt-3">
				<div className=" self-start">
					<Link to={`/single-post/${post?._id}`}>
						<h3 className=" max-[350px]:text-sm font-semibold min-[350px]:text-sm lg:text-lg mb-2 dark:text-slate-100 ">
							{post?.title}
						</h3>
					</Link>
					<div className=" hidden min-[870px]:flex ">
						<p className=" text-sm">
							{post?.description.slice(0, 150)}

							<Link
								to={`/single-post/${post?._id}`}
								className="ml-1 text-colorPrimary  hover:text-blue-400 transition-all cursor-pointer"
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
							"w-[80vw] min-[350px]:w-[120px] rounded-md relative border dark:border-slate-900"
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
