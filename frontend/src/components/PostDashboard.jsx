import React from "react";
import { Link } from "react-router-dom";

import { LazyLoadImg, Tooltip } from "../components";
import { LoadingSpinner } from "./LoadingSpinner";

const PostDashboard = ({ posts, status, title, page }) => {
	return (
		<div>
			<div className="flex justify-between">
				<h3 className=" font-bold text-gray-800 dark:text-slate-200 mb-3 text-xs ">
					{title}
				</h3>
				<Link
					to={`${page}`}
					className="text-xs font-medium text-blue-500 hover:text-blue-900 transition-all duration-75"
				>
					View All
				</Link>
			</div>
			<div className="  overflow-x-scroll custom-scrollbar flex gap-4 ">
				{posts?.map((item) => (
					<Link
						key={item?.post?._id}
						to={`/single-post/${item?.post?._id}`}
						className=" "
					>
						<div className=" hover:cursor-pointer w-30  overflow-y-hidden pb-4 flex gap-1 flex-col  items-center  ">
							<LazyLoadImg
								backgroundClassName={" rounded-lg  w-full  relative"}
								imgClassName={
									"absolute inset-0 w-full h-full rounded-lg  object-cover "
								}
								originalImgUrl={item?.post?.image}
								blurImageStr={item?.post?.blurImageUrl}
								optimizationStr={"q_auto,f_auto,w_200"}
								paddingBottom={"80%"}
							/>

							<div className=" font-medium text-xs w-[8rem] self-start ">
								<Tooltip info={item?.post?.title}>
									<h1>{`${item?.post?.title.slice(0, 30)}...`}</h1>
								</Tooltip>
							</div>
						</div>
					</Link>
				))}
				<div className=" grid place-content-center">
					{status === "loading" && <LoadingSpinner />}
				</div>
			</div>
		</div>
	);
};

export default PostDashboard;
