import React from "react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import { LazyLoadImg, Tooltip } from "../components";

const PostDashboard = ({ posts, status, title, page }) => {
	return (
		<div>
			<div className="flex justify-between">
				<h3 className=" font-bold text-gray-800 mb-3 text-xs ">{title}</h3>
				<Link
					to={`${page}`}
					className="text-xs font-medium text-blue-500 hover:text-blue-900 transition-all duration-75"
				>
					View All
				</Link>
			</div>
			<div className="  overflow-x-scroll custom-scrollbar flex gap-4 ">
				{posts?.map((item) => (
					<Link to={`/single-post/${item?.post?._id}`} className=" ">
						<div className=" hover:cursor-pointer w-30 h-30 flex gap-1 flex-col overflow-hidden items-center py-1 ">
							{/* <img
							src={post?.image}
							alt=""
							className=" w-full h-20 object-cover  border border-gray-300"
						/> */}

							<LazyLoadImg
								backgroundClassName={"   w-full h-20  relative"}
								imgClassName={
									"absolute inset-0 w-full h-full  object-cover "
								}
								originalImgUrl={item?.post?.image}
								blurImageStr={item?.post?.blurImageUrl}
								optimizationStr={"q_auto,f_auto,w_200"}
								paddingBottom={"80%"}
							/>

							<h3 className=" font-medium text-xs w-[9rem] mb-2 px-1">
								<Tooltip info={`${item?.post?.title?.slice(0, 20)}...`}>
									<h1>{item?.post?.title}</h1>
								</Tooltip>
							</h3>
						</div>
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
