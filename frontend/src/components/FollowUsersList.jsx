import React from "react";


import UserToFollow from "./UserToFollow";
import Spinner from "./Spinner";

const FollowUsersList = ({
	list,
	listTotalNumber,
	fetchingListStatus,
	isProfileView,
	fetchAction,
	title,
}) => {
	return (
		<div className=" my-4 flex flex-col ">
			{list?.map((user, index) => {
				return <UserToFollow user={user} index={index} />;
			})}

			{fetchingListStatus === "loading" && (
				<div className=" self-center">
				
					<Spinner />
				</div>
			)}
			{listTotalNumber !== list?.length &&
				fetchingListStatus !== "loading" && (
					<button
						onClick={(e) => {
							fetchAction(e);
						}}
						className="self-center rounded-lg px-2  border bg-blue-300 drop-shadow-md text-white border-gray-300 hover:bg-gray-300 transition-all delay-75"
					>
						{isProfileView ? `see all ${listTotalNumber}` : "load more"}
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
