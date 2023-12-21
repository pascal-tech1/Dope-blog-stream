import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Spinner, UserToFollow } from "../../components";

import {
	fetchWhoViewedUserProfile,
	setIsSearchBArNeeded,
} from "../../redux/user/userSlice";

const WhoViewedMyProfile = () => {
	const dispatch = useDispatch();
	const [pageNumber, setPageNumber] = useState(1);
	const {
		whoViewUserProfile,
		whoViewUserProfileStatus,
		whoViewUserProfileCount,
	} = useSelector((store) => store.userSlice);

	useEffect(() => {
		dispatch(setIsSearchBArNeeded(false));
	}, []);



	useEffect(() => {
		if (
			(pageNumber === 1 && whoViewUserProfile.length > 0) ||
			whoViewUserProfileStatus === "loading" ||
			whoViewUserProfileStatus === "undefine"
		)
			return;
		dispatch(fetchWhoViewedUserProfile({ page: pageNumber, limit: 10 }));
	}, [pageNumber]);

	return (
		<div>
			<div className="flex gap-3 font-inter  flex-col  dark:bg-[#171717] px-4">
				<h1 className="font-semibold place-self-center text-blue-400   max-w-max pb-1 ">
					Who view your profile
				</h1>

				<h3 className=" font-medium text-gray-900 drop-shadow-md dark:text-slate-200">
					who viewed your profile count:{" "}
					<span>{whoViewUserProfileCount} </span>
				</h3>

				{whoViewUserProfileCount === 0 && (
					<h1>NO one have viewed your profile yet</h1>
				)}
				{whoViewUserProfile.map((users) =>
					users?.viewedBy?.map((viewedBy, index) => (
						<div key={index}>
							{console.log(viewedBy)}
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
