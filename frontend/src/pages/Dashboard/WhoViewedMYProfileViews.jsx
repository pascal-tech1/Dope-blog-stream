import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
	LoadingSpinner,
	Spinner,
	Tooltip,
	UserToFollow,
} from "../../components";

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
			<div className="flex gap-3 font-inter  flex-col rounded-lg dark:bg-dark px-4">
				<h1 className="font-semibold place-self-center text-colorPrimary max-w-max pb-1 ">
					Who view your profile
				</h1>
				{whoViewUserProfileStatus === "loading" && !whoViewUserProfile ? (
					<LoadingSpinner />
				) : (
					<div>
						<h3 className=" font-medium text-gray-900 drop-shadow-md dark:text-slate-200">
							who viewed your profile count:
							<span>{whoViewUserProfileCount} </span>
						</h3>

						{whoViewUserProfileCount === 0 && (
							<h1>NO one have viewed your profile yet</h1>
						)}
						{whoViewUserProfile.map((users, index) => {
							if (users?.viewedBy?.length === 0) {
								return (
									<div key={index} className=" flex gap-3 mb-3 ">
										<img
											src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blq…auto,w_200/ank-profile-picture-973460_960_720.png"
											alt=""
											className=" rounded-full  w-6 h-6 "
										/>
										<Tooltip info={"this user is deleted"}>
											<h3 className=" text-red-400 gap-2 font-light capitalize">
												deleted user
											</h3>
										</Tooltip>
									</div>
								);
							} else
								return users?.viewedBy?.map((viewedBy, index) => {
									return (
										<div key={index}>
											<UserToFollow
												user={viewedBy}
												index={index}
												date={users.updatedAt}
												numberOfView={users.numberOfView}
											/>
										</div>
									);
								});
						})}
					</div>
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
