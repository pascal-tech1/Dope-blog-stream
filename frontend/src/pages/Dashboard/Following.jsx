import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchUserFollowingList,
	setFirstFetchFollowingUser,
	setIsSearchBArNeeded,
	setSearchTermInStore,
	updateFollowingListPageNumber,
} from "../../redux/user/userSlice";
import { ClearSearch, FollowUsersList } from "../../components";

const Following = ({ id }) => {
	useEffect(() => {
		dispatch(setIsSearchBArNeeded(true));
	}, []);
	const {
		user,
		userfollowinglist,
		followinglistTotalNumber,
		fetchingFollowingListStatus,
		followingUserListForNonLoginUser,
		followingUserListForNonLoginUserTotalNumber,
	} = useSelector((store) => store?.userSlice);

	const { dashboardSearchTerm } = useSelector((store) => store.userSlice);

	const dispatch = useDispatch();
	const _id = id || user?.id;
	const userLists = id
		? followingUserListForNonLoginUser
		: userfollowinglist;
	const status = id
		? followingUserListForNonLoginUserTotalNumber
		: followinglistTotalNumber;

	const handleFetchMoreButtonClicked = () => {
		dispatch(fetchUserFollowingList(_id));
		dispatch(updateFollowingListPageNumber());
	};

	useEffect(() => {
		if (!_id) return;
		dispatch(setFirstFetchFollowingUser());
		dispatch(fetchUserFollowingList(_id));
		dispatch(updateFollowingListPageNumber());
	}, [_id, dashboardSearchTerm]);
	const handleClearSearch = () => {
		dispatch(setSearchTermInStore(""));
	};
console.log(userLists, status)
	return (
		<div className=" grid max-w-md w-full font-inter ">
			{/* clear search */}
			<ClearSearch
				searchQuery={dashboardSearchTerm}
				handleClearSearch={handleClearSearch}
			/>
			{!id && (
				<h1 className="font-semibold place-self-center text-blue-400   max-w-max pb-1 ">
					Users you are following
				</h1>
			)}
			<div>
				<h3 className=" font-medium text-gray-900 drop-shadow-md dark:text-slate-200">
					total following user: <span>{followinglistTotalNumber} </span>{" "}
				</h3>
			</div>

			<FollowUsersList
				list={userLists}
				listTotalNumber={followinglistTotalNumber}
				fetchingListStatus={fetchingFollowingListStatus}
				fetchAction={handleFetchMoreButtonClicked}
				_id={_id}
				title={"following"}
			/>
		</div>
	);
};

export default Following;
