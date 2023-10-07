import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useCallback } from "react";
import { PostInfo, Spinner } from "../components";
import {
	fetchAllPost,
	searchPost,
	setSearchPage,
} from "../redux/post/allPostSlice";

const AllPost = () => {
	const dispatch = useDispatch();
	const { allPost, isLoading, searchQuery, hasMore } = useSelector(
		(store) => store.allPostSlice
	);

	useEffect(() => {
		allPost.length === 0 && dispatch(fetchAllPost(10));
		console.log("im here fetch all post");
	}, []);
	console.log(allPost.length);
	const observer = useRef();
	const lastPostRef = useCallback(
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
	console.log(allPost);
	return (
		<>
			{allPost.map((post, index) => {
				allPost.length === index + 1;
				return (
					<div
						key={index}
						ref={allPost.length === index + 1 ? lastPostRef : null}
						className=" border-t my-6 flex  flex-col md:flex-row gap-4 justify-between items-centers"
					>
						<PostInfo post={post} />
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
