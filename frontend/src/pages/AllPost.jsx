import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useCallback } from "react";
import { PostInfo, Spinner } from "../components";
import {
	IncreasePageNumber,
	fetchPostByCategory,
	setEmptySearch,
} from "../redux/post/allPostSlice";
import { MdCancel } from "react-icons/md";

const AllPost = () => {
	const dispatch = useDispatch();
	const { allPost, isLoading, searchQuery, hasMore, activeCategory } =
		useSelector((store) => store.allPostSlice);

	useEffect(() => {
		allPost.length === 0 &&
			searchQuery.length === 0 &&
			dispatch(fetchPostByCategory());
	}, []);

	const observer = useRef();
	const lastPostRef = useCallback(
		(node) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					dispatch(IncreasePageNumber());
					dispatch(fetchPostByCategory());
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, hasMore]
	);

	return (
		<>
			{searchQuery.length !== 0 && (
				<div className="flex gap-2 my-2">
					<h3>
						All Post found for
						<span className=" ml-1 text-blue-400">{searchQuery} in </span>
						<span className=" ml-1 text-blue-400">
							{activeCategory.toUpperCase()} category
						</span>
					</h3>
					<button
						onClick={(e) => {
							e.preventDefault();
							dispatch(setEmptySearch());
							dispatch(fetchPostByCategory());
						}}
						className=" text-2xl text-red-400 px-1  rounded-lg hover:text-red-600 drop-shadow-md transition-all delay-75"
					>
						<MdCancel />
					</button>
				</div>
			)}
			{allPost.map((post, index) => {
				return (
					<div
						key={index}
						ref={allPost.length === index + 1 ? lastPostRef : null}
						className=" mt-4  pr-[2px] "
					>
						{/* The post info's including the user info */}
						<PostInfo post={post} />
					</div>
				);
				//
			})}

			{/* loading Spinner */}
			<div className=" grid place-content-center">
				{isLoading && <Spinner />}
			</div>
			<div>
				{!hasMore && <h3 className=" text-yellow-300">No more Post</h3>}
			</div>
		</>
	);
};

export default AllPost;
