import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchUserFollowersList,
	setFirstFetchFollowersUser,
	setIsSearchBArNeeded,
	updateFollowersListPageNumber,
} from "../../redux/user/userSlice";
import { FollowUsersList } from "../../components";

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

	return (
		<div className=" grid max-w-md w-full ">
			<h1 className="font-semibold place-self-center text-blue-400   max-w-max pt-3 pb-1 ">
				{" "}
				Your followers
			</h1>
			<h3 className=" font-medium text-gray-900 md:text-slate-300 drop-shadow-md">
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
