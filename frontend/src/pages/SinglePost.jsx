import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSinglePost } from "../redux/post/singlePostSlice";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";

import { LikesSaveViews } from "../components";
import { AiOutlineMessage } from "react-icons/ai";
import { useInView } from "react-intersection-observer";
import { fetchMorePost, fetchUserPost } from "../redux/post/morePostSlice";

import {
	FollowingBtn,
	Spinner,
	MorePost,
	PostUserInfo,
} from "../components";
import { fetchPostByCategory } from "../redux/post/allPostSlice";

const SinglePost = () => {
	const { id } = useParams();
	const { post, status } = useSelector((store) => store.singlePostSlice);
	const dispatch = useDispatch();

	const { userPost, userPostStatus, morePost, morePostStatus } =
		useSelector((store) => store.morePostSlice);

	const { ref, inView } = useInView();

	useEffect(() => {
		if (post?._id !== id) dispatch(fetchSinglePost(id));
	}, [id]);

	useEffect(() => {
		if (inView && userPostStatus !== "success") {
			dispatch(
				fetchUserPost({ postId: post?._id, userId: post?.user?._id })
			);
			dispatch(fetchMorePost(10));
		}
	}, [inView]);
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
	if (status === "success")
		return (
			<div className="">
				<NavBar />
				<div className=" mt-16 mx-6 font-inter flex flex-col  lg:mx-auto max-w-[50rem] gap-[0.5rem]">
					<div>
						<h1 className=" font-bold text-2xl my-4">{post?.title}</h1>
					</div>
					{/* about the user who created the post */}
					<div className="flex flex-wrap   flex-col">
						<PostUserInfo post={post} />
						<LikesSaveViews post={post} />
					</div>
					<div className=" rounded-md flex items-center justify-center">
						<img
							src={post?.image}
							alt=""
							className="rounded-lg w-full object-cover h-[400px]"
						/>
					</div>
					<div
						className=" "
						dangerouslySetInnerHTML={{ __html: post?.content }}
					></div>

					<div ref={ref} className=" border-y py-4 my-4 ">
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
										className={` border self-center hover:bg-blue-800 text-center py-[0.4rem] px-4 bg-blue-900 text-white hover:text-white rounded-lg transition-all delay-75`}
									/>
									<div className=" bg-gray-500 w-11 h-11 rounded-full flex items-center justify-center text-white ">
										<AiOutlineMessage className=" text-2xl " />
									</div>
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
					<div className=" my-6">
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
							<MorePost post={morePost} status={morePostStatus} />
						)}
					</div>
				</div>
			</div>
		);
};

export default SinglePost;
