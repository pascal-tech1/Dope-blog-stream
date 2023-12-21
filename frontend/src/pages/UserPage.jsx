//////////////////////// import /////////////////////////////////////

import React, { useState, useEffect } from "react";
import {
	FollowingBtn,
	LazyLoadImg,
	MessageUser,
	MorePost,
	PostSearch,
	Spinner,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
	clearCreatorAllPost,
	fetchCreatorPosts,
	fetchPostCreatorProfile,
} from "../redux/post/generalPostSlice";
import Following from "./Dashboard/Following";

import { MdOutlineLanguage, MdWork } from "react-icons/md";
import { BiMap, BiSolidUserAccount } from "react-icons/bi";

/////////////////////////////////////////////////////////////
const UserPage = () => {
	const {
		postCreatorProfile,
		postCreatorProfileStatus,
		creatorPostStatus,
		creatorAllPost,

		hasMore,
	} = useSelector((store) => store.generalPostSlice);
	const loginUserId = useSelector((store) => store.userSlice?.user?._id);
	const dispatch = useDispatch();
	const { userId } = useParams();
	const [page, setPage] = useState(1);

	useEffect(() => {
		dispatch(clearCreatorAllPost());
		dispatch(fetchPostCreatorProfile(userId));
		setPage(1);
	}, [userId]);

	useEffect(() => {
		if (userId) {
			page === 1 && dispatch(clearCreatorAllPost(userId));

			dispatch(fetchCreatorPosts({ userId: userId, page }));
		}
	}, [page, userId]);

	if (postCreatorProfileStatus === "loading") {
		return (
			<div className=" grid place-content-center">
				<Spinner />
			</div>
		);
	}

	if (postCreatorProfileStatus === "failed") {
		return (
			<div className=" grid place-content-center">
				<h1 className=" text-red-500">
					Fetching User Profile Failed try again
				</h1>
				<button
					className=" bg-blue-400 rounded-lg px-1 py-1 hover:bg-blue-200 transition-all delay-75 place-self-center "
					onClick={(e) => {
						e.preventDefault();
						dispatch(fetchPostCreatorProfile(userId));
					}}
				>
					Retry
				</button>
			</div>
		);
	}

	if (postCreatorProfileStatus === "success") {
		return (
			<div>
				<PostSearch />
				<div className=" md:grid lg:grid-cols-3 mt-2  font-inter  gap-10 dark:bg-[#171717]  ">
					<div className=" flex flex-col gap-4 col-start-1 col-span-2   md:pt-4 h-max ">
						<div className="w-full">
							<div className=" w-full  relative">
								{!postCreatorProfile?.blurCoverPhoto && (
									<img
										src={postCreatorProfile?.coverPhoto}
										alt=""
										className=" h-[25vw] min-[400px]:h-[20vw] md:h-[14vw] lg:h-[12vw]  w-full rounded-md  "
									/>
								)}
								{postCreatorProfile?.blurCoverPhoto && (
									<div className=" h-[25vw] min-[400px]:h-[20vw] md:h-[14vw] lg:h-[12vw]  w-full rounded-md">
										<LazyLoadImg
											backgroundClassName={
												"   w-full h-full  relative rounded-md"
											}
											imgClassName={
												"absolute inset-0 w-full h-full rounded-md "
											}
											originalImgUrl={postCreatorProfile?.coverPhoto}
											blurImageStr={postCreatorProfile?.blurCoverPhoto}
											optimizationStr={"q_auto,f_auto,w_1000"}
											paddingBottom={"10%"}
										/>
									</div>
								)}
								{/* lazy loading image? */}
								<div className=" absolute top-1/4  h-[18vw] w-[18vw] md:h-[12vw] md:w-[12vw] lg:h-[10vw] lg:w-[10vw]   rounded-full border border-blue-600">
									<LazyLoadImg
										backgroundClassName={
											" rounded-full  w-full h-full  relative"
										}
										imgClassName={
											"absolute inset-0 w-full h-full  object-cover rounded-full "
										}
										originalImgUrl={postCreatorProfile?.profilePhoto}
										blurImageStr={postCreatorProfile?.blurProfilePhoto}
										optimizationStr={"q_auto,f_auto,w_200"}
										paddingBottom={"100%"}
									/>
								</div>
							</div>
						</div>
						{/* large screen more posts */}

						<div className=" md:mt-8 ">
							<h1 className="font-semibold  max-w-max dark:text-slate-200 ">
								Professional Summary
							</h1>
							<p className=" pr-4 py-2">{postCreatorProfile?.bio}</p>
						</div>
						<div className=" hidden lg:flex flex-col col-start-1 col-span-2   border-t dark:border-t-slate-700 ">
							<h1 className="font-semibold  max-w-max py-4  dark:text-slate-200 ">
								{`Posts By ${postCreatorProfile?.firstName} ${postCreatorProfile?.lastName}`}
							</h1>
							<MorePost
								titleLength={30}
								post={creatorAllPost}
								status={creatorPostStatus}
							/>
							{creatorAllPost?.length === 0 ? (
								<h1 className=" text-yellow-600 my-4">
									This user have no Post
								</h1>
							) : hasMore ? (
								<button
									onClick={(event) => {
										event.preventDefault();
										setPage(page + 1);
									}}
									className=" self-center rounded-md px-2 mb-4 border dark:border-slate-800 bg-blue-400 drop-shadow-md text-white border-gray-300 hover:bg-blue-600 transition-all delay-75"
								>
									load more
								</button>
							) : (
								<h1 className=" text-yellow-600 my-4">
									No More Post from this user
								</h1>
							)}
						</div>
					</div>
					{/* left */}

					<div className="  flex gap-3 lg:px-4 flex-col lg:sticky lg:top-0 lg:h-screen overflow-y-auto custom-scrollbar lg:pb-6 ">
						<div className="flex gap-3 items-center lg:pt-4 ">
							<h1 className="font-semibold   text-black  dark:text-slate-200 ">
								{`${postCreatorProfile?.firstName} ${postCreatorProfile?.lastName} Profile`}
							</h1>
							<FollowingBtn
								className="self-center text-blue-400 text-center  hover:text-blue-600 rounded-lg transition-all delay-75"
								userToFollowOrUnfollow={postCreatorProfile}
							/>
							<MessageUser receiverId={postCreatorProfile?._id} />
						</div>

						<h1 className=" ">{`${postCreatorProfile?.followersCount} followers`}</h1>
						<div className=" mb-2  flex gap-1 items-center">
							<MdWork className="text-blue-400" />{" "}
							{postCreatorProfile?.profession}
						</div>
						<div className=" mb-2  flex gap-1 items-center">
							<MdOutlineLanguage className="text-blue-400" />{" "}
							{postCreatorProfile?.language}
						</div>
						<div className="  mb-2  flex gap-1 items-center">
							<BiSolidUserAccount className="text-blue-400" />{" "}
							{postCreatorProfile?.nickName}
						</div>

						<div className=" mb-2  flex gap-1 items-center">
							<BiMap className="text-blue-400" />{" "}
							{postCreatorProfile?.location}
						</div>

						<h1 className="font-semibold  max-w-max pt-3 ">following</h1>

						<div className="">
							{postCreatorProfile?._id && (
								<Following
									id={
										loginUserId !== postCreatorProfile?._id &&
										postCreatorProfile?._id
									}
								/>
							)}
						</div>
					</div>
					{/* small screen more post */}

					<div className=" lg:hidden flex flex-col col-start-1 col-span-2  bg-white z-10 dark:bg-[#1C1C1C] px-4 rounded-md drop-shadow-sm  ">
						<h1 className="max-w-max font-semibold py-4 dark:text-slate-200 ">
							{`Posts By ${postCreatorProfile?.firstName} ${postCreatorProfile?.lastName}`}
						</h1>
						<div className=" ">
							<MorePost
								titleLength={30}
								post={creatorAllPost}
								status={creatorPostStatus}
							/>
						</div>

						{creatorAllPost?.length === 0 ? (
							<h1 className=" text-yellow-600 my-4">
								This user have no Post
							</h1>
						) : hasMore ? (
							<button
								onClick={(event) => {
									event.preventDefault();
									setPage(page + 1);
								}}
								className=" self-center mb-4 rounded-md px-2  border dark:border-slate-800 bg-blue-400 drop-shadow-md text-white border-gray-300 hover:bg-blue-600 transition-all delay-755"
							>
								load more
							</button>
						) : (
							<h1 className=" text-yellow-600 my-4">
								{/* No More Post from this user */}
							</h1>
						)}
					</div>
				</div>
			</div>
		);
	}
};

export default UserPage;
