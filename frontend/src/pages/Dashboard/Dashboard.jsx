import React, { useEffect } from "react";

import {
	BarChart,
	MessageSkeleton,
	PostDashboard,
	Spinner,
	UserDetailsCount,
	UserToFollow,
} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import {
	IncreaseHistoryPageNumber,
	IncreaseSavedPostPageNumber,
	fetchUserPostHistory,
	fetchSavedPosts,
	setSavedPostFirstSearch,
	setHistoryFirstSearch,
} from "../../redux/post/morePostSlice";
import { Link } from "react-router-dom";
import { clearMsg, fetchMsg } from "../../redux/message/messageSlice";
import {
	clearWhoViewedUserProfile,
	fetchPostImpressionsCount,
	fetchUserDetailsCounts,
	fetchWhoViewedUserProfile,
} from "../../redux/user/userSlice";
import { GiShadowFollower } from "react-icons/gi";
import { BsEye, BsPostcardFill } from "react-icons/bs";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { MdOutlineFollowTheSigns } from "react-icons/md";

const Dashboard = () => {
	const dispatch = useDispatch();
	const {
		user,
		userDetailsCount,
		whoViewUserProfile,
		chartSelectedFilter,
		userPostImpression,
		whoViewUserProfileStatus,
		userDetailsCountStatus,
	} = useSelector((store) => store?.userSlice);

	const {
		userPostHistory,
		userPostHistoryStatus,
		userSavedPost,
		userSavedPostStatus,
		savedPostHasMore,
		historyHasMore,
	} = useSelector((store) => store?.morePostSlice);
	const { msg, fetchMessageStatus } = useSelector(
		(store) => store?.messageSlice
	);

	const _id = user?._id;

	useEffect(() => {
		if (!_id) return;
		dispatch(fetchUserDetailsCounts());
		dispatch(clearMsg());
		dispatch(fetchMsg({ page: 1, limit: 5 }));
		dispatch(clearWhoViewedUserProfile());
		dispatch(fetchWhoViewedUserProfile({ page: 1, limit: 5 }));

		if (userSavedPost.length < 10 && savedPostHasMore) {
			dispatch(setSavedPostFirstSearch());
			dispatch(fetchSavedPosts(1));
		}
		if (userPostHistory.length < 10 && historyHasMore) {
			dispatch(setHistoryFirstSearch());
			dispatch(fetchUserPostHistory(1));
		}
	}, [_id]);

	useEffect(() => {
		if (!_id) return;
		dispatch(fetchPostImpressionsCount({ page: 1, numberPerPage: 10 }));
	}, [chartSelectedFilter, _id]);

	return (
		<div className=" flex flex-col gap-4  lg:grid grid-cols-12 lg:gap-8  lg:mx-0 font-inter antialiased">
			<div className="col-start-1 row-start-1 col-span-9 ">
				<div className=" grid grid-cols-2 min-[400px]:grid-cols-3 gap-2">
					<div className="  ">
						<UserDetailsCount
							text="Post"
							count={userDetailsCount?.postCount}
						>
							<BsPostcardFill className="text-purple-600 font-bold text-2xl bg-purple-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>
					<div className="  ">
						<UserDetailsCount
							text="Likes"
							count={userDetailsCount?.likesCount}
						>
							<AiFillLike className="text-orange-600 font-bold text-2xl bg-orange-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>
					<div className=" ">
						<UserDetailsCount
							text="Viewers"
							count={userDetailsCount?.viewsCount}
						>
							<BsEye className="text-green-600 font-bold text-2xl bg-green-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>

					<div className="">
						<UserDetailsCount
							text="dislikes"
							count={userDetailsCount?.disLikesCount}
						>
							<AiFillDislike className="text-red-600 font-bold text-2xl bg-yellow-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>
					<div className="  ">
						<UserDetailsCount
							bgColor={"bg-green-100"}
							textColor={"text-green-600"}
							text={"Followers"}
							count={userDetailsCount?.followersCount}
						>
							<GiShadowFollower className="text-yellow-600 font-bold text-2xl bg-yellow-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>
					<div className=" ">
						<UserDetailsCount
							text="Following"
							count={userDetailsCount?.followingCount}
						>
							<MdOutlineFollowTheSigns className="text-blue-600 font-bold text-2xl bg-blue-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>
				</div>

				{/* chart  */}
				<div className=" pt-4  flex flex-col gap-4 lg:flex-row justify-between">
					<div className="lg:w-[60%] bg-white pt-2 pb-8 rounded-md drop-shadow-sm px-2 ">
						<h1 className=" font-bold text-xs text-gray-800 mb-3">
							post Charts
						</h1>

						<BarChart />
					</div>
					{/* viewedBy */}
					<div className=" col-start-8 col-span-4  lg:w-[37%] md:w-[50%] bg-white py-2  rounded-md shadow-sm px-4 ">
						<h1 className=" font-bold text-xs text-gray-800 mb-3 mt-10 lg:mt-0">
							Who's Viewed your profile
						</h1>
						{whoViewUserProfileStatus === "loading" ? (
							<MessageSkeleton />
						) : (
							whoViewUserProfile.map((users, index) =>
								users?.viewedBy?.map((viewedBy, index) => (
									<div key={index}>
										<UserToFollow
											user={viewedBy}
											index={index}
											date={users.updatedAt}
											numberOfView={users.numberOfView}
										/>
									</div>
								))
							)
						)}
					</div>
				</div>
			</div>

			{/* messages */}
			<div className=" lg:col-start-10 lg:col-span-full row-start-1  bg-white py-2 rounded-md drop-shadow-sm px-2 ">
				<h1 className=" font-bold text-gray-800 mb-3 text-xs">
					Recent Mesaages
				</h1>
				{fetchMessageStatus === "loading" ? (
					<MessageSkeleton />
				) : (
					<div className="flex gap-6 flex-col">
						{msg.map((message) => {
							return (
								<Link
									to={`/profile/${message?.sender?._id}`}
									className="flex gap-2"
								>
									<img
										src={message?.sender?.profilePhoto}
										alt=""
										className=" self-start border bg-blue-400 w-10 h10 rounded-lg"
									/>
									<div className=" text-xs font-medium flex gap-1 flex-col">
										<h3 className="  text-pink-400">
											{`${message?.sender?.firstName} ${message?.sender?.lastName}`}
										</h3>
										<h3>{`${message?.message.slice(0, 60)}...`}</h3>
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</div>
			{/* post history */}
			<div className=" col-start-1 col-span-full  flex gap-8 flex-col bg-white py-2  rounded-md drop-shadow-sm px-4 ">
				<PostDashboard
					posts={userPostHistory.slice(0, 10)}
					status={userPostHistoryStatus}
					title={"Post View History"}
					page={"/post-History"}
				/>
			</div>
			<div className=" col-start-1 col-span-full mb-6 flex gap-8 flex-col  bg-white py-2  rounded-md drop-shadow-sm px-4 ">
				<PostDashboard
					posts={userSavedPost.slice(0, 10)}
					status={userSavedPostStatus}
					title={"Saved Post"}
					page={"/post-Saved"}
				/>
			</div>
		</div>
	);
};

export default Dashboard;
