import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { MessageSkeleton, Spinner, UserToFollow } from "../../components";

import { fetchWhoViewedUserProfile, setIsSearchBArNeeded } from "../../redux/user/userSlice";

const WhoViewedMyProfile = () => {
	useEffect(() => {
		dispatch(setIsSearchBArNeeded(false));
	}, []);
	const dispatch = useDispatch();
	// const { msg, fetchMessageStatus, receivedMessageCount } = useSelector(
	// 	(store) => store?.messageSlice
	// );
	const {
		whoViewUserProfile,
		whoViewUserProfileStatus,
		whoViewUserProfileCount,
	} = useSelector((store) => store?.userSlice);
	const [pageNumber, setPageNumber] = useState(1);

	useEffect(() => {
		if (pageNumber === 1 && whoViewUserProfile.length > 0) return;
		dispatch(fetchWhoViewedUserProfile({ page: pageNumber, limit: 1 }));
	}, [pageNumber]);
	return (
		<div>
			<div className="flex gap-3  flex-col  dark:bg-[#171717] px-4">
				{whoViewUserProfile.map((users, index) =>
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
				{whoViewUserProfileCount > whoViewUserProfile.length && (
					<div>
						{whoViewUserProfileStatus === "loading" ? (
							<Spinner />
						) : (
							<button
								onClick={() => setPageNumber((prev) => prev + 1)}
								className=" text-white self-start bg-blue-400 px-2 hover:bg-blue-600 transition-all delay-75 drop-shadow-lg rounded-lg "
							>
								load more
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default WhoViewedMyProfile;
