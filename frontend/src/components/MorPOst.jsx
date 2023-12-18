import React from "react";

import { Link } from "react-router-dom";
import LikesSaveViews from "./LikesSaveViews";
import PostUserInfo from "./PostUserInfo";

import LazyLoadImg from "./LazyLoadImg";
import { Spinner, Tooltip } from "../components";

export const MorePost = ({ post, status }) => {
	return (
		<>
			<div className="  grid grid-cols-1 text-sm   gap-12 min-[600px]:grid-cols-2 w-[100%]">
				{post?.map((post, index) => (
					<div
						key={index}
						className=" max-w-[384px] col-span-1 flex gap-3 flex-col dark:bg-[#171717] bg-gray-100 rounded-md
					"
					>
						<Link
							to={`/single-post/${post?._id}`}
							className=" hover:cursor-pointer"
						>
							<LazyLoadImg
								backgroundClassName={
									" w-full  min-[600px]:w-full  rounded-md relative "
								}
								imgClassName={
									"absolute inset-0 w-full h-full object-cover rounded-md"
								}
								originalImgUrl={post?.image}
								blurImageStr={post.blurImageUrl}
								optimizationStr={`q_auto,f_auto,w_384`}
								paddingBottom={"50%"}
							/>
						</Link>

						<div className=" px-2 pb-2">
							<div className=" dark:text-slate-300">
								<Tooltip info={post.title}>
									<h3>{post.title}</h3>
								</Tooltip>
							</div>

							<PostUserInfo post={post} />
							<LikesSaveViews post={post} />
						</div>
					</div>
				))}
				<div className=" grid place-content-center">
					{status === "loading" && <Spinner />}
				</div>
			</div>
		</>
	);
};

{
	/* <LazyLoadImg
	backgroundClassName={" w-full rounded-md relative "}
	imgClassName={"absolute inset-0 w-full h-full object-cover rounded-md"}
	originalImgUrl={post?.image}
	blurImageStr={post.blurImageUrl}
	optimizationStr={`q_auto,f_auto,w_384`}
	// paddingBottom={true}
/>; */
}
