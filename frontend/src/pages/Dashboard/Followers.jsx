import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchUserFollowersList,
	setFirstFetchFollowersUser,
	setIsSearchBArNeeded,
	setSearchTermInStore,
	updateFollowersListPageNumber,
} from "../../redux/user/userSlice";
import { ClearSearch, FollowUsersList } from "../../components";

const Following = () => {
	useEffect(() => {
		dispatch(setIsSearchBArNeeded(true));
		
	}, []);
	const {
		user,
		userFollowerslist,
		followerslistTotalNumber,
		fetchingFollowersListStatus,
	} = useSelector((store) => store?.userSlice);
	const dispatch = useDispatch();
	const _id = user?.id;
	const { dashboardSearchTerm } = useSelector((store) => store.userSlice);

	const handleFetchMoreButtonClicked = (e) => {
		e.preventDefault();
		dispatch(fetchUserFollowersList());
		dispatch(updateFollowersListPageNumber());
	};

	useEffect(() => {
		if (!_id) return;
		dispatch(setFirstFetchFollowersUser());
		dispatch(fetchUserFollowersList());
		dispatch(updateFollowersListPageNumber());
	}, [_id,dashboardSearchTerm]);
	const handleClearSearch = () => {
		dispatch(setSearchTermInStore(""));
		
	};

	return (
		<div className=" grid max-w-md w-full ">
			{/* clear search */}
			<ClearSearch
				searchQuery={dashboardSearchTerm}
				handleClearSearch={handleClearSearch}
			/>
			<h1 className="font-semibold place-self-center text-blue-400   max-w-max pt-3 pb-1 ">
				{" "}
				Your followers
			</h1>
			<h3 className=" font-medium dark:text-gray-400 text-gray-800">
				total followers : <span>{followerslistTotalNumber} </span>{" "}
			</h3>

			<FollowUsersList
				list={userFollowerslist}
				listTotalNumber={followerslistTotalNumber}
				fetchingListStatus={fetchingFollowersListStatus}
				fetchAction={handleFetchMoreButtonClicked}
				_id={_id}
				title={"followers"}
			/>
		</div>
	);
};

export default Following;
