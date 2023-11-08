import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchUserFollowingList,
	setFirstFetchFollowingUser,
	updateFollowingListPageNumber,
} from "../../redux/user/userSlice";
import { FollowUsersList } from "../../components";

const Following = () => {
	const {
		user,
		userfollowinglist,
		followinglistTotalNumber,
		fetchingFollowingListStatus,
	} = useSelector((store) => store?.userSlice);
	const dispatch = useDispatch();
	const _id = user?.id;

	const handleFetchMoreButtonClicked = () => {
		dispatch(fetchUserFollowingList());
		dispatch(updateFollowingListPageNumber());
	};

	useEffect(() => {
		if (!_id) return;
		dispatch(setFirstFetchFollowingUser());
		dispatch(fetchUserFollowingList());
		dispatch(updateFollowingListPageNumber());
	}, [_id]);

	return (
		<div className=" grid max-w-md w-full px-6 mt-16">
			<h1 className="font-semibold place-self-center text-blue-400  max-w-max pt-3 pb-1 ">
				{" "}
				Users you are following
			</h1>
			<h3 className=" font-medium text-gray-900 drop-shadow-md">
				total following user: <span>{followinglistTotalNumber} </span>{" "}
			</h3>

			<FollowUsersList
				list={userfollowinglist}
				listTotalNumber={followinglistTotalNumber}
				fetchingListStatus={fetchingFollowingListStatus}
				fetchAction={handleFetchMoreButtonClicked}
				_id={_id}
			/>
		</div>
	);
};

export default Following;
