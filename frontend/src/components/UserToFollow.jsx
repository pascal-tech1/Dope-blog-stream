import React from "react";
import { FollowingBtn } from "./FollowingBtn";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDate } from "../utils/dataFormatter";

import MessageUser from "./MessageUser";
import LazyLoadImg from "./LazyLoadImg";

const UserToFollow = ({ user, index, date, numberOfView }) => {
	const loginUser = useSelector((store) => store.userSlice?.user);
	return (
		<div
			key={index}
			className="flex justify-between pb-3 items-start font-inter  dark:text-slate-300"
		>
			<Link
				to={loginUser?._id ? `/profile/${user._id}` : `/login`}
				className="flex gap-4 justify-start "
			>
				{/* lazy loading image */}
				<div>
					<LazyLoadImg
						backgroundClassName={" rounded-full  w-6 h-6  relative"}
						imgClassName={
							"absolute inset-0 w-full h-full  object-cover rounded-full "
						}
						originalImgUrl={user?.profilePhoto}
						blurImageStr={user?.blurProfilePhoto}
						optimizationStr={"q_auto,f_auto,w_100"}
						paddingBottom={"100%"}
					/>
				</div>

				<div>
					<div className=" flex items-center text-sm gap-2 font-light">
						<div className=" flex flex-wrap gap-1">
							<h1 className=" capitalize">{user?.firstName}</h1>
							<h1 className=" capitalize">{user?.lastName}</h1>
						</div>
					</div>

					{date && (
						<div>
							<h3 className=" text-gray-400 lowercase">{` ${formatDate(
								date
							)}`}</h3>
						</div>
					)}
				</div>
			</Link>

			{/* checking to either render the messageUser commponent or followingBtn component
			 using the date since i will be returning the date only if im rending who viewed use portfolio */}
			{date ? (
				<div className="">
					<MessageUser receiverId={user?._id} />
				</div>
			) : (
				<div>
					<FollowingBtn
						userToFollowOrUnfollow={user}
						className=" text-blue-300   hover:dark:bg-gray-700  px-2 my-[0.2rem] rounded-lg hover:bg-blue-200 transition-all delay-75   "
					/>
				</div>
			)}
		</div>
	);
};

export default UserToFollow;
