import React from "react";
import Spinner from "./spinner";
import { useDispatch } from "react-redux";
import UserToFollow from "./UserToFollow";

const FollowUsersList = ({
	list,
	listTotalNumber,
	fetchingListStatus,
	fetchAction,
	_id,
}) => {
	const dispatch = useDispatch();
	return (
		<div className=" my-4">
			{list?.map((user, index) => {
				return <UserToFollow user={user} index={index} />;
			})}

			{listTotalNumber !== list?.length &&
				(fetchingListStatus === "loading" ? (
					<Spinner />
				) : (
					<button
						onClick={(e) => {
							e.preventDefault();

							dispatch(
								fetchAction({
									startIndex: 0,
									endIndex: listTotalNumber,
									userId: _id,
								})
							);
						}}
						className="text-sm b rounded-lg px-2 text-black border border-gray-300 hover:bg-gray-300 transition-all delay-75"
					>
						{`see all${listTotalNumber}`}
					</button>
				))}
			{listTotalNumber === 0 && (
				<div>
					<h1 className="mt-6"> followers list is empty</h1>
				</div>
			)}
		</div>
	);
};

export default FollowUsersList;
