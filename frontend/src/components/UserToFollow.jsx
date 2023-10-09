import React from "react";
import { FollowingBtn } from "./FollowingBtn";

const UserToFollow = ({ user, index }) => {
	return (
		<div key={index} className="flex justify-between lg:mx-6 my-5">
			<div className="flex gap-3 ">
				<div >
					<img
						className=" w-8 h-8 rounded-full"
						src={user?.profilePhoto}
						alt=""
					/>
				</div>
				<div>
					<h3 className=" text-xs text-gray-900">{user?.lastName}</h3>
					<h3 className=" text-xs text-gray-4s00">{user?.profession}</h3>
				</div>
			</div>
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
