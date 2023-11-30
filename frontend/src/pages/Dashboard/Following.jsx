import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchUserFollowingList,
	setFirstFetchFollowingUser,
	updateFollowingListPageNumber,
} from "../../redux/user/userSlice";
import { FollowUsersList } from "../../components";

const Following = ({ id }) => {
	const {
		user,
		userfollowinglist,
		followinglistTotalNumber,
		fetchingFollowingListStatus,
		followingUserListForNonLoginUser,
		followingUserListForNonLoginUserTotalNumber,
	} = useSelector((store) => store?.userSlice);
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
	}, [_id]);
	console.log(userLists);
	console.log(_id);
	return (
		<div className=" grid max-w-md w-full ">
			{!id && (
				<div>
					<h1 className="font-semibold place-self-center text-blue-400  max-w-max pb-1 ">
						Users you are following
					</h1>
					<h3 className=" font-medium text-gray-900 drop-shadow-md">
						total following user: <span>{followinglistTotalNumber} </span>{" "}
					</h3>
				</div>
			)}

			<FollowUsersList
				list={userLists}
				listTotalNumber={status}
				fetchingListStatus={fetchingFollowingListStatus}
				fetchAction={handleFetchMoreButtonClicked}
				_id={_id}
				title={"following"}
			/>
		</div>
	);
};

export default Following;
