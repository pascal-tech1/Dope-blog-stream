import React from "react";
import { FollowingBtn } from "./FollowingBtn";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDate } from "../utils/dataFormatter";
import { BsEye } from "react-icons/bs";
import MessageUser from "./MessageUser";
import LazyLoadImg from "./LazyLoadImg";

const UserToFollow = ({ user, index, date, numberOfView }) => {
	const loginUser = useSelector((store) => store.userSlice?.user);
	return (
		<div
			key={index}
			className="flex justify-between gap-3 items-center py-2"
		>
			<Link
				to={loginUser?._id ? `/profile/${user._id}` : `/login`}
				className="flex gap-4 items-center "
			>
				{/* <div>
					<img
						className=" w-8 h-8 rounded-full"
						src={user?.profilePhoto}
						alt=""
					/>
				</div> */}
				{/* lazyloading */}

				<div>
					<LazyLoadImg
						backgroundClassName={" rounded-full  w-10 h-10  relative"}
						imgClassName={
							"absolute inset-0 w-full h-full  object-cover rounded-full "
						}
						originalImgUrl={user?.profilePhoto}
						blurImageStr={user?.blurProfilePhoto}
						optimizationStr={"q_auto,f_auto,w_100"}
					/>
				</div>

				<div>
					<div className=" flex items-center gap-2 font-light text-sm text-gray-900">
						{`${user?.firstName} ${user?.lastName}`}
						{date && (
							<div className="flex items-center gap-1 text-sm ">
								<BsEye className=" text-xs" /> {numberOfView}
							</div>
						)}
					</div>
					{date && <h3 className="text-xs">{user?.profession}</h3>}

					{date && (
						<div>
							<h3 className=" text-gray-400 text-xs lowercase">{`viewed ${formatDate(
								date
							)}`}</h3>
						</div>
					)}
				</div>
			</Link>
			{date ? (
				<div>
					<MessageUser receiverId={user?._id} />
				</div>
			) : (
				<div>
					<FollowingBtn
						userToFollowOrUnfollow={user}
						className="border border-blue-200  px-2 my-[0.2rem] rounded-lg hover:bg-blue-200 transition-all delay-75  text-sm "
					/>
				</div>
			)}
		</div>
	);
};

export default UserToFollow;
