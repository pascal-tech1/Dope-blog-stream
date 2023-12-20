import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import {
	clearSavedPost,
	fetchSavedPosts,
} from "../../redux/post/morePostSlice";
import { ClearSearch, LazyLoadImg, Spinner } from "../../components";

import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dataFormatter";
import { setSearchTermInStore } from "../../redux/user/userSlice";

const Saved = () => {
	const dispatch = useDispatch();
	const { userSavedPost, savedPostHasMore, userSavedPostStatus } =
		useSelector((store) => store.morePostSlice);
	const [page, setPage] = useState(1);
	const { dashboardSearchTerm } = useSelector((store) => store.userSlice);

	useEffect(() => {
		setPage(1);
		dispatch(clearSavedPost());
		dispatch(fetchSavedPosts(1));
	}, [dashboardSearchTerm]);

	useEffect(() => {
		page > 1 && dispatch(fetchSavedPosts(page));
	}, [page]);

	const observer = useRef();
	const lastPostRef = useCallback(
		(node) => {
			if (userSavedPostStatus === "loading") return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && savedPostHasMore) {
					setPage((prev) => prev + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[savedPostHasMore]
	);

	// Organize userSavedPost by date
	const organizedPosts = userSavedPost.reduce((acc, post) => {
		const dateKey = formatDate(post.updatedAt);
		if (!acc[dateKey]) {
			acc[dateKey] = [];
		}
		acc[dateKey].push(post);
		return acc;
	}, {});

	const handleClearSearch = () => {
		dispatch(setSearchTermInStore(""));
	};

	return (
		<div className=" font-inter">
			{/* clear search */}
			<ClearSearch
				searchQuery={dashboardSearchTerm}
				handleClearSearch={handleClearSearch}
			/>
			{Object.keys(organizedPosts).map((dateKey, firstIndex) => (
				<div
					key={dateKey}
					className=" border-b dark:border-b-gray-800 pb-3"
				>
					<h2 className=" text-blue-400  py-3">{dateKey}</h2>
					<div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
						{organizedPosts[dateKey].map((item, index) => {
							let isLastPost;
							const post = item?.post;
							if (firstIndex === Object.keys(organizedPosts).length - 1) {
								isLastPost =
									organizedPosts[
										Object.keys(organizedPosts)[
											Object.keys(organizedPosts).length - 1
										]
									].length ===
									index + 1;
							}

							return (
								<div
									key={index}
									ref={isLastPost ? lastPostRef : null}
									className="dark:bg-[#171717] rounded-md"
								>
									<Link
										to={`/single-post/${post?._id}`}
										className="flex gap-4 justify-between"
									>
										<div className="hover:cursor-pointer flex-1">
											<LazyLoadImg
												backgroundClassName={
													"  rounded-lg  w-full h-20  relative"
												}
												imgClassName={
													"absolute inset-0 w-full h-full rounded-lg  object-cover "
												}
												originalImgUrl={item?.post?.image}
												blurImageStr={item?.post?.blurImageUrl}
												optimizationStr={"q_auto,f_auto,w_200"}
												paddingBottom={"80%"}
											/>
										</div>
										<h3 className="font-medium flex-1 self-start py-2">
											{post?.title}
										</h3>
									</Link>
								</div>
							);
						})}
					</div>
				</div>
			))}
			<div className="grid place-content-center">
				{userSavedPostStatus === "loading" && <Spinner />}
			</div>
			<div>
				{userSavedPost.length === 0 && (
					<h3 className=" text-center text-yellow-400 py-4">
						No Post found
					</h3>
				)}
			</div>

			<div>
				{!savedPostHasMore && userSavedPost.length !== 0 && (
					<h3 className=" text-center text-yellow-400 py-4">
						No more Post
					</h3>
				)}
			</div>
		</div>
	);
};

export default Saved;
