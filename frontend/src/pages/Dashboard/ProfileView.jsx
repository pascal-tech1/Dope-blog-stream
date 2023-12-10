import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
	AdditionalUserProfile,
	CoverPhoto,
	FollowUsersList,
	ProfilePhoto,
	Spinner,
	UserBio,
	UserProfile,
} from "../../components";
import {
	fetchUserFollowingList,
	fetchUserFollowersList,
	updateFollowingListPageNumber,
	setFirstFetchFollowersUser,
	setFirstFetchFollowingUser,
	setIsSearchBArNeeded,
} from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const ProfileView = () => {
	useEffect(() => {
		dispatch(setIsSearchBArNeeded(false));
	}, []);
	const {
		user,
		userfollowinglist,
		followinglistTotalNumber,
		fetchingFollowingListStatus,
		userFollowerslist,
		followerslistTotalNumber,
		fetchingFollowersListStatus,
	} = useSelector((store) => store?.userSlice);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const _id = user?.id;

	useEffect(() => {
		if (!_id) return;
		dispatch(setFirstFetchFollowingUser());
		dispatch(fetchUserFollowingList(_id));
		dispatch(updateFollowingListPageNumber());
		dispatch(setFirstFetchFollowersUser());
		dispatch(fetchUserFollowersList());
	}, [_id]);
	const handleNavigateToFollowing = (e) => {
		e.preventDefault();
		navigate("/follows-following");
	};
	const handleNavigateToFollower = (e) => {
		e.preventDefault();
		navigate("/follows-followers");
	};
	if (!user) {
		return <h3 className=" text-black text-3xl">Loading ....</h3>;
	}

	return (
		<>
			<div className=" flex flex-col row-span-2 md:grid grid-cols-6 col-start-1 col-span-4 rounded-xl  lg:mb-6 lg:shadow-sm lg:rounded-md lg:ml-0  font-inter gap-5 bg-whitedark:bg-[#1C1C1C] lg:bg-transparent">
				<div className=" col-start-1 col-span-4  bg-white dark:bg-[#171717] lg:shadow-sm lg:rounded-md">
					<div className="w-full relative ">
						<div className=" w-full  ">
							<CoverPhoto user={user} />
						</div>
						<ProfilePhoto user={user} />
						<div className="  mt-[4.5rem]  ">
							<UserProfile />
						</div>
					</div>
					{/* summary */}
					<UserBio />
				</div>

				{/* profile Additional details */}
				<AdditionalUserProfile />

				{/* following  */}
				<div className=" md:col-start-1 col-span-3 px-4 bg-white dark:bg-[#171717] rounded-md ">
					<h1 className="font-semibold  max-w-max pt-3 pb-1 text-blue-400 ">
						following
					</h1>

					<FollowUsersList
						list={userfollowinglist}
						listTotalNumber={followinglistTotalNumber}
						fetchingListStatus={fetchingFollowingListStatus}
						_id={_id}
						isProfileView={true}
						fetchAction={handleNavigateToFollowing}
						title={"following"}
					/>
				</div>
				{/* followers  */}
				<div className=" md:col-start-4 col-span-full bg-white dark:bg-[#171717] px-4 rounded-md">
					<h1 className="font-semibold  max-w-max pt-3 pb-1 text-blue-400 ">
						followers
					</h1>

					<FollowUsersList
						list={userFollowerslist}
						listTotalNumber={followerslistTotalNumber}
						fetchingListStatus={fetchingFollowersListStatus}
						_id={_id}
						isProfileView={true}
						fetchAction={handleNavigateToFollower}
						title={"followers"}
					/>
				</div>
			</div>
		</>
	);
};

export default ProfileView;
