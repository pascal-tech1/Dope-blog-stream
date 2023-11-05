import React, { useState, useEffect } from "react";
import {
	FollowingBtn,
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
		!loginUserId && navigate('/login')
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
	console.log(postCreatorProfileStatus);
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
			<>
				<NavBar />
				<div className=" grid   md:grid-cols-3 grid-flow-row-dense  font-inter mx-6 mt-20 ml-10 gap-10 bg-white">
					<div className=" flex flex-col gap-4 col-start-1 col-span-2  bg-white md:pt-4 h-max ">
						<div className="w-full">
							<div className=" w-full  relative">
								<img
									src={postCreatorProfile?.profilePhoto}
									alt=""
									className=" h-32 md:h-48 object-cover w-full rounded-lg"
								/>
								<img
									src={postCreatorProfile?.profilePhoto}
									alt=""
									className=" absolute w-32 h-32 top-0 md:top-1/2 rounded-full"
								/>
							</div>
						</div>

						<div className=" mt-4 md:mt-20">
							<h1 className="font-semibold  max-w-max  ">
								Professional Summary
							</h1>
							<p className=" mt-3 pr-4 py-2">{postCreatorProfile?.bio}</p>
						</div>
						<div className=" hidden md:flex flex-col col-start-1 col-span-2  bg-white border-t ">
							<h1 className="font-semibold  max-w-max py-4 ">
								{`Posts By ${postCreatorProfile?.firstName} ${postCreatorProfile?.lastName}`}
							</h1>
							<MorePost post={creatorAllPost} status={creatorPostStatus} />
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

					<div className=" flex flex-col gap-3 place-items-center md:border-l relative ">
						<div className=" text-gray-400 flex gap-3 flex-col md:pl-4">
							<div className="flex gap-4 items-center md:pt-4 justify-center">
								<h1 className="font-semibold   text-black ">
									{`${postCreatorProfile?.firstName} ${postCreatorProfile?.lastName} Profile`}
								</h1>
								<FollowingBtn
									className=" border self-center hover:bg-blue-800 text-center  px-2 bg-blue-900 text-white hover:text-white rounded-lg transition-all delay-75"
									userToFollowOrUnfollow={postCreatorProfile}
								/>
							</div>

							<h1 className=" text-sm">{`${100} followers`}</h1>
							<h3 className=" mb-2 text-sm">
								{postCreatorProfile?.profession}
							</h3>
							<h1 className="font-semibold  max-w-max pt-3 pb-1 ">
								following
							</h1>

							<div className="-mt-4">
								{postCreatorProfile?.following
									?.slice(0, viewAll)
									.map((user, index) => {
										return <UserToFollow user={user} index={index} />;
									})}
								{postCreatorProfile?.following?.length > viewAll && (
									<button
										onClick={(e) => {
											e.preventDefault();
											setViewAll(postCreatorProfile?.length);
										}}
										className="text-sm b rounded-lg px-2 text-black border border-gray-300 hover:bg-gray-300 transition-all delay-75"
									>
										{`see all${postCreatorProfile?.following?.length}`}
									</button>
								)}
								{postCreatorProfile?.following?.length === 0 && (
									<h1>{`${postCreatorProfile?.lastName} following list is empty`}</h1>
								)}
							</div>
						</div>
					</div>
					<div className=" md:hidden flex flex-col col-start-1 col-span-2  bg-white border-t ">
						<h1 className="max-w-max font-semibold py-4 ">
							{`Posts By ${postCreatorProfile?.firstName} ${postCreatorProfile?.lastName}`}
						</h1>
						<MorePost post={creatorAllPost} status={creatorPostStatus} />

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
			</>
		);
	}
};

export default UserPage;
