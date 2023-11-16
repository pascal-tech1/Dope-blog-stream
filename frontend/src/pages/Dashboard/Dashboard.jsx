import React, { useEffect } from "react";

import {
	BarChart,
	PostDashboard,
	Spinner,
	UserDetailsCount,
	UserToFollow,
} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchUserPostHistory,
	fetchUserSavedPost,
} from "../../redux/post/morePostSlice";
import { Link } from "react-router-dom";
import { fetchMsg } from "../../redux/message/messageSlice";
import {
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
	} = useSelector((store) => store?.userSlice);

	const {
		userPostHistory,
		userPostHistoryStatus,
		userSavedPost,
		userSavedPostStatus,
	} = useSelector((store) => store?.morePostSlice);
	const { msg, fetchMessageStatus } = useSelector(
		(store) => store?.messageSlice
	);

	const _id = user?._id;
	console.log(_id);
	useEffect(() => {
		if (!_id) return;
		console.log("im herre 1");
		dispatch(fetchUserDetailsCounts());
		dispatch(fetchMsg({ page: 1, limit: 4 }));
		dispatch(fetchWhoViewedUserProfile());
	}, [_id]);

	useEffect(() => {
		if (!_id) return;
		console.log("im herre 2");
		dispatch(fetchPostImpressionsCount({ page: 1, numberPerPage: 10 }));
	}, [chartSelectedFilter, _id]);

	useEffect(() => {
		console.log(fetchMessageStatus);
		if (fetchMessageStatus === "success") {
			userPostHistory.length === 0 && dispatch(fetchUserPostHistory());
			userSavedPost.length === 0 && dispatch(fetchUserSavedPost());
		}
	}, [fetchMessageStatus]);

	return (
		<div className=" flex flex-col  lg:grid grid-cols-12 lg:gap-8  px-6 lg:mx-0 font-inter antialiased">
			<div className="col-start-1 row-start-1 col-span-9 ">
				<div className=" flex flex-wrap justify-between md:grid grid-cols-3 gap-2">
					<div className="  col-start-1 ">
						<UserDetailsCount
							text="Post"
							count={userDetailsCount?.postCount}
						>
							<BsPostcardFill className="text-purple-600 font-bold text-2xl bg-purple-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>
					<div className="  col-start-2">
						<UserDetailsCount
							text="Likes"
							count={userDetailsCount?.likesCount}
						>
							<AiFillLike className="text-orange-600 font-bold text-2xl bg-orange-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>
					<div className=" col-start-3">
						<UserDetailsCount
							text="Viewers"
							count={userDetailsCount?.viewsCount}
						>
							<BsEye className="text-green-600 font-bold text-2xl bg-green-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>

					<div className=" col-start-1 row-start-2">
						<UserDetailsCount
							text="dislikes"
							count={userDetailsCount?.disLikesCount}
						>
							<AiFillDislike className="text-red-600 font-bold text-2xl bg-yellow-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>
					<div className=" col-start-2 row-start-2 ">
						<UserDetailsCount
							bgColor={"bg-green-100"}
							textColor={"text-green-600"}
							text={"Followers"}
							count={userDetailsCount?.followersCount}
						>
							<GiShadowFollower className="text-yellow-600 font-bold text-2xl bg-yellow-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>
					<div className=" col-start-3 row-start-2">
						<UserDetailsCount
							text="Following"
							count={userDetailsCount?.followingCount}
						>
							<MdOutlineFollowTheSigns className="text-blue-600 font-bold text-2xl bg-blue-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>
				</div>
				{/* chart  */}
				<div className=" pt-4  flex flex-col lg:flex-row justify-between">
					<div className="lg:w-[60%]  ">
						<h1 className=" font-bold text-xs text-gray-800 mb-3">
							post Charts
						</h1>
						<BarChart />
					</div>
					{/* viewedBy */}
					<div className=" col-start-8 col-span-4 px-1 w-[37%] ">
						<h1 className=" font-bold text-xs text-gray-800 mb-3">
							Who's Viewed your profile
						</h1>
						{whoViewUserProfile?.map((users, index) =>
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
						)}
					</div>
				</div>
			</div>

			{/* messages */}
			<div className=" lg:col-start-10 lg:col-span-full row-start-1 rounded-lg bg-white px-3  ">
				<h1 className=" font-bold text-gray-800 mb-3 text-xs">
					Recent Mesaages
				</h1>
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
			</div>
			{/* post history */}
			<div className=" col-start-1 col-span-full  border-t py-4 flex gap-8 flex-col ">
				<PostDashboard
					posts={userPostHistory}
					status={userPostHistoryStatus}
					title={"Post View History"}
					page={"/dashboard/post-History"}
				/>
			</div>
			<div className=" col-start-1 col-span-full mb-6 border-y py-4 flex gap-8 flex-col ">
				<PostDashboard
					posts={userSavedPost}
					status={userSavedPostStatus}
					title={"Saved Post"}
					page={"/dashboard/post-Saved"}
				/>
			</div>
		</div>
	);
};

export default Dashboard;
