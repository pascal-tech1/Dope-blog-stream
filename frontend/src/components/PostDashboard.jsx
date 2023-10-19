import React from "react";
import { Link } from "react-router-dom";
import Spinner from "./spinner";

const PostDashboard = ({ posts, status, title, page }) => {
	return (
		<div>
			<div className="flex justify-between">
				<h3 className=" font-bold text-gray-800 mb-3  ">{title}</h3>
				<Link
					to={`${page}`}
					className="text-xs font-medium text-blue-500 hover:text-blue-900 transition-all duration-75"
				>
					View All
				</Link>
			</div>
			<div className=" flex gap-4 overflow-x-scroll ">
				{posts?.map((post) => (
					<Link to={`/single-post/${post?._id}`} className="">
						<div className=" hover:cursor-pointer">
							<img
								src={post?.image}
								alt=""
								className="rounded-lg w-28 object-cover mb-3 self-center border border-gray-300"
							/>
						</div>
						<h3 className=" font-medium text-xs w-[9rem]">
							{post?.title}
						</h3>
					</Link>
				))}
				<div className=" grid place-content-center">
					{status === "loading" && <Spinner />}
				</div>
			</div>
		</div>
	);
};

export default PostDashboard;
