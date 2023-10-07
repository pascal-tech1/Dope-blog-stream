import React from "react";
import Spinner from "./spinner";
import { Link } from "react-router-dom";
import CategoryandLikes from "./CategoryandLikes";
import PostUserInfo from "./PostUserInfo";

export const MorePost = ({ post, status }) => {
	if (status === "idle") {
		return <h3>more user post</h3>;
	}
	if (status === "loading") {
		return (
			<div className=" grid place-content-center">
				<Spinner />
			</div>
		);
	}
	if (status === "success") {
		return (
			<>
				<div className=" border-b pb-6 grid grid-cols-1 place-content-center min-[600px]:grid-cols-2 gap-8 w-[100%] mb-10">
					{post.map((post) => (
						<div className=" max-w-[384px] col-span-1">
							<Link
								to={`/single-post/${post?._id}`}
								className=" hover:cursor-pointer"
							>
								<img
									src={post?.image}
									alt=""
									className=" w-full h-[163px] object-cover "
								/>
							</Link>
							<h3 className=" text font-bold">{post?.title}</h3>
							<PostUserInfo post={post} />
							<CategoryandLikes post={post} />
						</div>
					))}
				</div>
			</>
		);
	}
};
