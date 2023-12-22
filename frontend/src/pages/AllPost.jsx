import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useCallback } from "react";
import { ClearSearch, PostInfo, Spinner } from "../components";
import {
	IncreasePageNumber,
	fetchPostByCategory,
	setEmptySearch,
} from "../redux/post/allPostSlice";

const AllPost = () => {
	const dispatch = useDispatch();
	const { allPost, isLoading, searchQuery, hasMore } = useSelector(
		(store) => store.allPostSlice
	);

	useEffect(() => {
		if (isLoading) return;
		allPost.length === 0 &&
			searchQuery.length === 0 &&
			dispatch(fetchPostByCategory());
	}, []);

	const observer = useRef();
	const lastPostRef = useCallback(
		(node) => {
			if (isLoading) return;
			console.log(isLoading)
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					dispatch(IncreasePageNumber());
					dispatch(fetchPostByCategory());
				}
			});
			if (node) observer.current.observe(node);
		},
		[hasMore,isLoading]
	);
	const handleClearSearch = () => {
		dispatch(setEmptySearch());
		dispatch(fetchPostByCategory());
	};
	return (
		<>
			<ClearSearch
				searchQuery={searchQuery}
				handleClearSearch={handleClearSearch}
			/>

			{allPost.map((post, index) => {
				return (
					<div
						key={index}
						ref={allPost.length === index + 1 ? lastPostRef : null}
						className=" pr-[2px] "
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
