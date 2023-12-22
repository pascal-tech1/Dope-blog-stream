import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSinglePost, setStatus } from "../redux/post/singlePostSlice";
import { useParams } from "react-router-dom";

import {
	LazyLoadImg,
	LikesSaveViews,
	MessageUser,
	PostSearch,
} from "../components";

import { clearUserPost, fetchUserPost } from "../redux/post/morePostSlice";

import {
	FollowingBtn,
	Spinner,
	MorePost,
	PostUserInfo,
} from "../components";
import {
	clearMorePost,
	clearSearchAndCategory,
	fetchPostByCategory,
} from "../redux/post/allPostSlice";
import { addCopyButtons } from "../utils/PostCopyButton";

const SinglePost = () => {
	const { id } = useParams();
	const [pageNumber, setPageNumber] = useState(1);
	const dispatch = useDispatch();

	// state imports
	const { post, status } = useSelector((store) => store.singlePostSlice);
	const { morePost, morePostStatus, morePostHasMore, isLoading } =
		useSelector((store) => store.allPostSlice);
	const { userPost, userPostStatus } = useSelector(
		(store) => store.morePostSlice
	);
	// Call the function to add copy buttons after the component renders
	useEffect(() => {
		const copyButton = document.querySelector(".copy-button");
		if (copyButton) return;
		addCopyButtons();
	}, [status]);

	const observer = useRef();

	const lastPostRef = useCallback(
		(node) => {
			if (status !== "success") return;
			console.log(morePostStatus);
			console.log(userPostStatus);
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					dispatch(clearUserPost());
					dispatch(clearMorePost());
					setPageNumber(1);
					dispatch(
						fetchUserPost({ postId: post?._id, userId: post?.user?._id })
					);

					// clearing the search because there wont be enough selected category to display for the user since we have limited data
					dispatch(clearSearchAndCategory());
					dispatch(
						fetchPostByCategory({
							page: 1,
							postNumberPerPage: 10,
							where: "morePost",
						})
					);

					dispatch(setStatus("idle"));
				}
			});
			if (node) observer.current.observe(node);
		},
		[status]
	);

	useEffect(() => {
		if (post?._id !== id) dispatch(fetchSinglePost(id));
	}, [id]);

	useEffect(() => {
		dispatch(clearSearchAndCategory());
		pageNumber > 1 &&
			dispatch(
				fetchPostByCategory({
					page: pageNumber,
					postNumberPerPage: 10,
					where: "morePost",
				})
			);
	}, [pageNumber]);

	if (status === "loading")
		return (
			<div className=" grid place-content-center mt-8">
				<Spinner />
			</div>
		);
	if (status === "error") {
		return (
			<div className=" text-red-600">failed to fetch Post try again</div>
		);
	}

	if (post)
		return (
			<div className=" lg:max-w-[55rem] md:mx-auto">
				<PostSearch />

				<div className=" font-inter    overflow-x-hidden  gap-[0.5rem] -z-50 px-2  md:px-10 ">
					<div className=" flex flex-col gap-2">
						<div>
							<h1 className=" font-bold text-xl  lg:text-3xl  my-2 md:my-4 dark:text-slate-200">
								{post?.title}
							</h1>
						</div>
						{/* about the user who created the post and post likes and views */}
						<div className="flex flex-wrap flex-col">
							<PostUserInfo post={post} />
							<LikesSaveViews post={post} />
						</div>
						<div>
							<h3 className="text-xs text-gray-500 ">
								{post?.description}
							</h3>
						</div>

						<div className=" flex items-center ">
							<LazyLoadImg
								backgroundClassName={
									" w-full h-auto rounded-md relative overflow-hidden"
								}
								imgClassName={
									"absolute inset-0 w-full h-auto object-cover rounded-md"
								}
								originalImgUrl={post?.image}
								blurImageStr={post?.blurImageUrl}
								optimizationStr={`q_auto,f_auto,w_800`}
							/>
						</div>
					</div>
					{/*  the post content in the dom */}
					<div
						ref={lastPostRef}
						className=" mt-4 dark:text-slate-300 "
						dangerouslySetInnerHTML={{ __html: post?.content }}
					/>

					{/* when the user scroll to this div with lasPostRef a fetch request for 
					userPost and morePost is trigered in the useCallBackHook */}
					<div className=" border-y dark:border-y-lightdark py-4 my-4 ">
						<div className="flex justify-between flex-col my-4">
							<img
								src={post?.user?.profilePhoto}
								alt=""
								className=" h-14 w-14 md:w-20 md:h-20 rounded-full object-cover"
							/>

							<div className=" flex justify-between  items-center">
								<h3 className=" font-md mt-3 text-2xl dark:text-slate-200">
									Written by{" "}
									<span>
										{post?.user?.firstName} {post?.user?.lastName}
									</span>
								</h3>
								<div className="flex items-center gap-2">
									{/* followingBtn component */}
									<FollowingBtn
										userToFollowOrUnfollow={post?.user}
										className={` border self-center hover:bg-blue-800 text-center px-2 bg-blue-900 text-white hover:text-white rounded-lg transition-all delay-75`}
									/>

									{/* message component */}
									<MessageUser receiverId={post?.user?._id} />
								</div>
							</div>
							<div className="flex gap-3">
								<h3>
									{post?.user?.followers?.length}
									<span className=" ml-1">Followers</span>
								</h3>
								<h3>{post?.user?.profession}</h3>
							</div>
						</div>
					</div>

					{/* more post from the user */}
					<div className=" my-6">
						<h1 className=" text-center font-bold text-xl dark:text-slate-200">
							More Posts from{" "}
							{`${post?.user?.firstName} ${post?.user?.lastName}`}
						</h1>
					</div>
					{userPost && (
						<MorePost
							post={userPost}
							status={userPostStatus}
							titleLength={43}
						/>
					)}

					{/* more post from blogvana */}
					<div className=" my-6 flex flex-col justify-center items-center mx-auto ">
						<h1 className=" flex items-center gap-3  justify-center font-bold text-xl mb-4 dark:text-slate-200">
							More Posts from Blogvana{" "}
							<span>
								<img
									src="../../public/blogvana.png"
									alt=""
									className="w-12 "
								/>
							</span>
						</h1>
						{morePost && <MorePost post={morePost} status={isLoading} />}

						<div className=" ">
							{morePostHasMore ? (
								<button
									onClick={() => {
										setPageNumber((prev) => prev + 1);
									}}
									className=" bg-blue-400  text-white px-2 my-4  rounded-md hover:bg-blue-600 transition-all delay-75"
								>
									{isLoading ? <Spinner /> : "load more"}
								</button>
							) : (
								<h1 className=" text-yellow-400">NO more Post</h1>
							)}
						</div>
					</div>
				</div>
			</div>
		);
};

export default SinglePost;
