import React from "react";
import { FollowingBtn } from "./FollowingBtn";
import { Link } from "react-router-dom";

const UserToFollow = ({ user, index }) => {
	return (
		<div key={index} className="flex justify-between items-center my-5">
			<Link
				to={`/profile/${user?._id}`}
				className="flex gap-8 items-center "
			>
				<div>
					<img
						className=" w-8 h-8 rounded-full"
						src={user?.profilePhoto}
						alt=""
					/>
				</div>

				<h3 className=" text-xs text-gray-900">{`${user?.firstName} ${user?.lastName}`}</h3>
			</Link>
			<div>
				<FollowingBtn
					userToFollowOrUnfollow={user}
					className=" border  px-2 my-[0.2rem] rounded-lg hover:bg-gray-200 transition-all delay-75  text-sm "
				/>
			</div>
		</div>
	);
};

export default UserToFollow;
