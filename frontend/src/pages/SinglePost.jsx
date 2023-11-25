import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSinglePost, setStatus } from "../redux/post/singlePostSlice";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";

import { LazyLoadImg, LikesSaveViews, MessageUser } from "../components";
import { AiOutlineMessage } from "react-icons/ai";
import { useInView } from "react-intersection-observer";
import {
	clearUserPost,
	fetchMorePost,
	fetchUserPost,
} from "../redux/post/morePostSlice";

import {
	FollowingBtn,
	Spinner,
	MorePost,
	PostUserInfo,
} from "../components";
import {
	clearMorePost,
	fetchPostByCategory,
} from "../redux/post/allPostSlice";

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
	//
	console.log(pageNumber);
	const observer = useRef();
	const lastPostRef = useCallback(
		(node) => {
			if (status !== "success") return;
			if (morePostStatus === "loading") return;
			if (userPostStatus === "loading") return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					dispatch(clearUserPost());
					dispatch(clearMorePost());
					setPageNumber(1);

					dispatch(
						fetchUserPost({ postId: post?._id, userId: post?.user?._id })
					);

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
		[status, morePostStatus, userPostStatus, morePostHasMore]
	);

	useEffect(() => {
		if (post?._id !== id) dispatch(fetchSinglePost(id));
	}, [id]);

	useEffect(() => {
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
			<div className="">
				<NavBar />
				<div className=" mt-16 mx-6 font-inter flex flex-col   lg:mx-auto max-w-[50rem] gap-[0.5rem] -z-50">
					<div>
						<h1 className=" font-bold text-sm md:text-2xl my-4">
							{post?.title}
						</h1>
					</div>
					{/* about the user who created the post */}
					<div className="flex flex-wrap   flex-col">
						<PostUserInfo post={post} />
						<LikesSaveViews post={post} />
					</div>

					<div className="">
						{/* <LazyLoadImg
							backgroundClassName={" rounded-md h-full w-full relative  "}
							imgClassName={
								" inset-0 w-full h-full object-cover rounded-md "
							}
							originalImgUrl={post?.image}
							// blurImageStr={post?.blurImageUrl}
							optimizationStr={"q_auto,f_auto"}
						/> */}
						<img className="" src={post?.image} alt="" />
					</div>

					<div
						className=" "
						dangerouslySetInnerHTML={{ __html: post?.content }}
					></div>

					<div ref={lastPostRef} className=" border-y py-4 my-4 ">
						<div className="flex justify-between flex-col my-4">
							<img
								src={post?.user?.profilePhoto}
								alt=""
								className=" h-14 w-14 md:w-20 md:h-20 rounded-full object-cover"
							/>

							<div className=" flex justify-between  items-center">
								<h3 className=" font-md mt-3 text-2xl">
									Written by{" "}
									<span>
										{post?.user?.firstName} {post?.user?.lastName}
									</span>
								</h3>
								<div className="flex items-center gap-2">
									<FollowingBtn
										userToFollowOrUnfollow={post?.user}
										className={` border self-center hover:bg-blue-800 text-center py-1 px-2 bg-blue-900 text-white hover:text-white rounded-lg transition-all delay-75`}
									/>

									{/* message */}
									<MessageUser receiverId={post?.user?._id} />
								</div>
							</div>
							<div className="flex gap-3">
								<h3>
									{post?.user?.followers.length}
									<span className=" ml-1">Followers</span>
								</h3>
								<h3>{post?.user?.profession}</h3>
							</div>
						</div>
					</div>

					{/* more post from the user */}
					<div className=" my-6">
						<h1 className=" text-center font-bold text-xl">
							More Posts from{" "}
							{`${post?.user?.firstName} ${post?.user?.lastName}`}
						</h1>
					</div>
					{userPost && (
						<MorePost post={userPost} status={userPostStatus} />
					)}

					{/* more post from blogvana */}
					<div className=" my-6 flex flex-col">
						<h1 className=" flex items-center gap-3  justify-center font-bold text-xl mb-4">
							More Posts from Blogvana{" "}
							<span>
								<img
									src="../../public/blogvana.png"
									alt=""
									className="w-12 "
								/>
							</span>
						</h1>
						{morePost && (
							<MorePost post={morePost} status={isLoading} />
						)}
						{console.log(isLoading)}
						<div className=" self-center">
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
