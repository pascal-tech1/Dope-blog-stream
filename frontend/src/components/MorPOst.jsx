import React from "react";
import Spinner from "./spinner";
import { Link } from "react-router-dom";
import CategoryandLikes from "./CategoryandLikes";
import PostUserInfo from "./PostUserInfo";

export const MorePost = ({ post, status }) => {
	return (
		<>
			<div className="  grid grid-cols-1 place-content-center min-[600px]:grid-cols-2 gap-8 w-[100%]">
				{post?.map((post) => (
					<div className=" max-w-[384px] col-span-1">
						<Link
							to={`/single-post/${post?._id}`}
							className=" hover:cursor-pointer"
						>
							<img
								src={post?.image}
								alt=""
								className="rounded-lg w-full h-[163px] object-cover mb-3 "
							/>
						</Link>
						<h3 className=" text font-bold ">{post?.title}</h3>
						<PostUserInfo post={post} />
						<CategoryandLikes post={post} />
					</div>
				))}
				<div className=" grid place-content-center">
					{status === "loading" && <Spinner />}
				</div>
			</div>
		</>
	);
};
