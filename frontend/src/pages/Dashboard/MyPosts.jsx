import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { date } from "yup";
import {
	clearCreatorAllPost,
	fetchCreatorPosts,
} from "../../redux/post/generalPostSlice";
import { formatDate } from "../../utils/dataFormatter";
import { EditPostBtn, Spinner } from "../../components";

const MyPosts = () => {
	const {
		creatorPostStatus,
		creatorAllPost,
		creatoPostTotalNumber,
		hasMore,
	} = useSelector((store) => store.generalPostSlice);
	const id = useSelector((store) => store.userSlice?.user?._id);
	const [page, setPage] = useState(0);
	const dispatch = useDispatch();
	const observer = useRef();

	const lastPostRef = useCallback(
		(node) => {
			if (creatorPostStatus === "loading") return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPage(page + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[creatorPostStatus, hasMore]
	);

	useEffect(() => {
		setPage(1);
		dispatch(clearCreatorAllPost());
	}, []);
	useEffect(() => {
		id && dispatch(fetchCreatorPosts({ userId: id, page }));
	}, [page, id]);

	const posts = [
		{
			all: "box",
			title: "Post title",
			createdAt: "Created",
			category: "Category",
			numViews: "views",
			likes: "likes",
			disLikes: "disLikes",
			action: "action",
		},

		...creatorAllPost,
	];
	return (
		<div className="mt-16 shadow-md rounded-lg  font-medium min-w-[300px] mx-2  md:mx-6 grid  ">
			<div className="flex justify-between mx-6 mb-4">
				<button className="  py-[0.15] rounded-lg hover:text-red-700 text-red-400">
					delete
				</button>
				<h3 className="flex gap-2 items-center ">
					Total Post :<span>{creatoPostTotalNumber}</span>
				</h3>
			</div>
			{posts.map((post, index) => {
				return (
					<div
						ref={posts.length === index + 1 ? lastPostRef : null}
						className={`${
							post.action === "action" ? " bg-gray-500  text-white" : ""
						}  grid grid-cols-7 md:grid-cols-11 text-left border-b py-4 md:px-2 `}
					>
						<div className="col-start-1 col-span-3 px-2 flex gap-2">
							<input
								type="checkbox"
								name="check"
								id="check"
								className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
							/>
							<Link to={`/single-post/${post._id}`}>{post.title}</Link>
						</div>
						<h3 className=" hidden md:flex  col-start-4 col-span-2">
							{post.createdAt === "Created"
								? "Created"
								: formatDate(post.createdAt)}
						</h3>
						<h3 className=" hidden md:flex   col-start-6 col-span-2">
							{post.category}
						</h3>
						<h3 className="  col-start-4 md:col-start-8 md:col-span-1 ">
							{post.numViews}
						</h3>
						<h3 className="  col-start-5 md:col-start-9 col-span-1">
							{post.likes === "likes" ? "Like" : post.likes.length}
						</h3>
						<h3
							className="  col-start-6 md:col-start-10 
						 col-span-1"
						>
							{post.disLikes === "disLikes"
								? "disLikes"
								: post.disLikes.length}
						</h3>

						<h3 className="col-start-7 col-span-1 ml-2 md:col-start-11">
							{post.action === "action" ? (
								"Action"
							) : (
								<EditPostBtn postId={post._id} />
							)}
						</h3>
					</div>
				);
			})}
			<div className="my-2 place-self-center">
				{creatorPostStatus === "loading" && <Spinner />}
			</div>
			<div className=" place-self-center">
				{!hasMore && creatorPostStatus === "success" && (
					<div className=" text-yellow-600 my-4">No more Post Buddy</div>
				)}
			</div>
		</div>
	);
};

export default MyPosts;
