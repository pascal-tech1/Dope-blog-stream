import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import {
	fetchUserPostHistory,
	setHistoryFirstSearch,
} from "../../redux/post/morePostSlice";
import { Spinner } from "../../components";

import { Link } from "react-router-dom";

const PostHistory = () => {
	const dispatch = useDispatch();
	const { userPostHistory, historyHasMore, userPostHistoryStatus } =
		useSelector((store) => store.morePostSlice);

	const [page, setPage] = useState(1);
	const observer = useRef();
	const lastPostRef = useCallback(
		(node) => {
			if (userPostHistoryStatus === "loading") return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && historyHasMore) {
					setPage(page + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[userPostHistoryStatus, historyHasMore]
	);

	useEffect(() => {
		setPage(1);
		dispatch(setHistoryFirstSearch());
	}, []);

	useEffect(() => {
		dispatch(fetchUserPostHistory(page));
	}, [page]);
	return (
		<div className="mx-4">
			<div className="flex max-w-full justify-between flex-wrap gap-6 ">
				{userPostHistory.map((post, index) => {
					return (
						<div
							key={index}
							ref={
								userPostHistory.length === index + 1 ? lastPostRef : null
							}
							className=" mx-auto"
						>
							<Link
								to={`/single-post/${post?._id}`}
								className=" flex max-w-[15rem] gap-4 items-center md:items-center"
							>
								<div className=" hover:cursor-pointer">
									<img
										src={post?.image}
										alt=""
										className="rounded-lg max-w-[5rem] object-cover mb-3 self-center border border-gray-300"
									/>
								</div>
								<h3 className=" font-medium text-xs w-[9rem]">
									{post?.title}
								</h3>
							</Link>
						</div>
					);
					//
				})}
			</div>
			<div className=" grid place-content-center">
				{userPostHistoryStatus === "loading" && <Spinner />}
			</div>
			<div>{!historyHasMore && <h3>No more Post</h3>}</div>
		</div>
	);
};

export default PostHistory;
