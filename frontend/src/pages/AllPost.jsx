import React from "react";
import {
	fetchAllPost,
	fetchSinglePost,
	searchPost,
	setSearchPage,
} from "../redux/post/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/dataFormatter";
import { Spinner } from "../components";

const AllPost = () => {
	const dispatch = useDispatch();
	const { allPost, isLoading, searchQuery, hasMore, page } = useSelector(
		(store) => store.allPostSlice
	);
	useEffect(() => {
		dispatch(fetchAllPost());
	}, []);

	const observer = useRef();
	const lastBookElementRef = useCallback(
		(node) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					dispatch(setSearchPage());
					if (searchQuery) {
						dispatch(searchPost());
					} else {
						dispatch(fetchAllPost());
					}
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, hasMore]
	);

	// if (isLoading) {
	// 	return (
	// 		<div className=" grid place-content-center text-4xl text-blue-800 font-extrabold">
	// 			loading ...
	// 		</div>
	// 	);
	// }

	return (
		<>
			{allPost.map((post, index) => {
				allPost.length === index + 1;
				return (
					<div
						key={index}
						ref={allPost.length === index + 1 ? lastBookElementRef : null}
						className=" border-t my-6 flex  flex-col md:flex-row gap-4 justify-between items-centers"
					>
						<div className="flex flex-col mt-3 mb-2 justify-self-center">
							{/* user who created the post  */}
							<Link
								to="/user-profile"
								className="flex text-xs gap-3 text-gray-400"
							>
								<img
									src={post?.user?.profilePhoto}
									alt=""
									className="w-8 h-8 rounded-full "
								/>

								<div>
									<h3 className="">{formatDate(post?.createdAt)}</h3>
									<h3>
										{` ${post?.user?.firstName} ${post?.user?.lastName}  `}
									</h3>
								</div>
							</Link>

							<div className="flex  flex-col md:flex-row justify-centers gap-8 mt-3">
								<div className=" self-start">
									<h3 className=" font-semibold text-lg mb-3 ">
										{post?.title}
									</h3>
									<div className=" text-xs flex ">
										<p>
											{post?.description}
											{"..."}
											<Link
												to={`/single-post/${post?._id}`}
												className="ml-1 text-blue-300 hover:text-blue-400 transition-all cursor-pointer"
											>
												Read more
											</Link>
										</p>
									</div>
								</div>
								<div className=" self-center md:self-start">
									<img
										className=" max-w-xs w-52 rounded-md"
										src={post?.image}
										alt=""
									/>
								</div>
							</div>
						</div>
					</div>
				);
				//
			})}
			<div className=" grid place-content-center">
				{isLoading && <Spinner />}
			</div>
			<div>{!hasMore && <h3>No more Post</h3>}</div>
		</>
	);
};

export default AllPost;
