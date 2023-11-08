import React from "react";
import Spinner from "./spinner";

import UserToFollow from "./UserToFollow";

const FollowUsersList = ({
	list,
	listTotalNumber,
	fetchingListStatus,
	isProfileView,
	fetchAction,
	title,
}) => {
	return (
		<div className=" my-4">
			{list?.map((user, index) => {
				return <UserToFollow user={user} index={index} />;
			})}

			{fetchingListStatus === "loading" && <Spinner />}
			{listTotalNumber !== list?.length &&
				fetchingListStatus !== "loading" && (
					<button
						onClick={(e) => {
							fetchAction(e);
						}}
						className="text-sm b rounded-lg px-2  border bg-blue-300 drop-shadow-md text-white border-gray-300 hover:bg-gray-300 transition-all delay-75"
					>
						{isProfileView ? `see all${listTotalNumber}` : "load more"}
					</button>
				)}

			{listTotalNumber === 0 && fetchingListStatus !== "loading" && (
				<div>
					<h1 className="mt-6">{`${title} list is empty`}</h1>
				</div>
			)}
		</div>
	);
};

export default FollowUsersList;
