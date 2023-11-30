//////////////////////// import /////////////////////////////////////

import React, { useState, useEffect } from "react";
import {
	FollowingBtn,
	LazyLoadImg,
	MessageUser,
	MorePost,
	NavBar,
	Spinner,
	UserToFollow,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
	clearCreatorAllPost,
	fetchCreatorPosts,
	fetchPostCreatorProfile,
} from "../redux/post/generalPostSlice";
import Following from "./Dashboard/Following";
import { LuLanguages } from "react-icons/lu";
import { MdOutlineLanguage, MdWork, MdWorkOff } from "react-icons/md";
import { BiMap, BiSolidUserAccount } from "react-icons/bi";

/////////////////////////////////////////////////////////////
const UserPage = () => {
	const {
		postCreatorProfile,
		postCreatorProfileStatus,
		creatorPostStatus,
		creatorAllPost,
		creatorAllPostTotalPages,
		hasMore,
	} = useSelector((store) => store.generalPostSlice);
	const loginUserId = useSelector((store) => store.userSlice?.user?._id);
	const dispatch = useDispatch();
	const { userId } = useParams();
	const [page, setPage] = useState(1);
	const [viewAll, setViewAll] = useState(1);
	const navigate = useNavigate();

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
				{console.log("i have rendered")}
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
	console.log(postCreatorProfile);
	if (postCreatorProfileStatus === "success") {
		return (
			<div className="overflow-y-auto custom-scrollbar">
				<NavBar />
				<div className=" grid lg:grid-cols-3 grid-flow-row-dense  font-inter  mt-16  gap-10 bg-white px-6 ">
					<div className=" flex flex-col gap-4 col-start-1 col-span-2  bg-white md:pt-4 h-max ">
						<div className="w-full">
							<div className=" w-full  relative">
								{!postCreatorProfile.blurCoverPhoto && (
									<img
										src={postCreatorProfile?.coverPhoto}
										alt=""
										className=" h-[25vw] min-[400px]:h-[20vw] md:h-[14vw] lg:h-[12vw]  w-full rounded-md  "
									/>
								)}
								{postCreatorProfile.blurCoverPhoto && (
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
								{/* <img
									src={postCreatorProfile?.profilePhoto}
									alt=""
									className=" absolute top-1/4  h-[18vw] w-[18vw] md:h-[12vw] md:w-[12vw] lg:h-[10vw] lg:w-[10vw]   rounded-full border border-blue-600"
								/> */}

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

						<div className=" md:mt-8 ">
							<h1 className="font-semibold  max-w-max  ">
								Professional Summary
							</h1>
							<p className=" pr-4 py-2">{postCreatorProfile?.bio}</p>
						</div>
						<div className=" hidden lg:flex flex-col col-start-1 col-span-2  bg-white border-t ">
							<h1 className="font-semibold  max-w-max py-4 ">
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
									className=" self-center my-4 border px-2 rounded-lg hover:bg-gray-200 transition-all delay-75"
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
					<div className=" flex flex-col gap-3  lg:border-l relative col-start-3  col-span-full ">
						<div className="  flex gap-3 lg:px-4 flex-col  lg:fixed lg:w-[30vw] lg:h-[90vh] lg:pb-6 overflow-y-auto custom-scrollbar ">
							<div className="flex gap-3 items-center lg:pt-4 ">
								<h1 className="font-semibold   text-black ">
									{`${postCreatorProfile?.firstName} ${postCreatorProfile?.lastName} Profile`}
								</h1>
								<FollowingBtn
									className="self-center text-blue-800 text-center  hover:text-blue-900 rounded-lg transition-all delay-75"
									userToFollowOrUnfollow={postCreatorProfile}
								/>
								<MessageUser receiverId={postCreatorProfile._id} />
							</div>

							<h1 className=" text-sm">{`${postCreatorProfile.followersCount} followers`}</h1>
							<div className=" mb-2 text-sm flex gap-1 items-center">
								<MdWork className="text-blue-400" />{" "}
								{postCreatorProfile?.profession}
							</div>
							<div className=" mb-2 text-sm flex gap-1 items-center">
								<MdOutlineLanguage className="text-blue-400" />{" "}
								{postCreatorProfile?.language}
							</div>
							<div className="  mb-2 text-sm flex gap-1 items-center">
								<BiSolidUserAccount className="text-blue-400" />{" "}
								{postCreatorProfile?.nickName}
							</div>

							<div className=" mb-2 text-sm flex gap-1 items-center">
								<BiMap className="text-blue-400" />{" "}
								{postCreatorProfile?.location}
							</div>

							<h1 className="font-semibold  max-w-max pt-3 ">following</h1>

							{postCreatorProfile?._id && (
								<Following
									id={
										loginUserId !== postCreatorProfile._id &&
										postCreatorProfile._id
									}
								/>
							)}
						</div>
					</div>
					<div className=" lg:hidden flex flex-col col-start-1 col-span-2  bg-white  ">
						<h1 className="max-w-max font-semibold py-4 ">
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
								className=" self-center my-4 border px-2 rounded-lg hover:bg-gray-200 transition-all delay-75"
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
