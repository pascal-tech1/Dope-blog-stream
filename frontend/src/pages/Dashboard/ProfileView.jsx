import React from "react";
import { useSelector } from "react-redux";
import {
	AdditionalUserProfile,
	UserBio,
	UserProfile,
} from "../../components";

import { MdEdit } from "react-icons/md";

const ProfileView = () => {
	const user = useSelector((store) => store?.userSlice?.user);
	const category = ["design", "developtment", "ux", "marketing"];

	return (
		<div className=" flex flex-col md:ml-14 row-span-2 lg:grid grid-cols-6 pcol-start-1 col-span-4 rounded-xl mx-4 lg:mb-6 pt-4 lg:shadow-sm lg:rounded-md lg:ml-0  font-inter mt-10 gap-5 bg-white lg:bg-transparent">
			<div className=" col-start-1 col-span-4  bg-white lg:shadow-sm lg:rounded-md">
				<div className="w-full relative ">
					<div className=" w-full ">
						<img
							src={user?.profilePhoto}
							alt=""
							className=" h-28  w-full"
						/>
					</div>
					<img
						src={user?.profilePhoto}
						alt=""
						className="absolute top-1/4 left-8 w-16 h-16 md:w-32 md:h-32 rounded-full"
					/>
					<UserProfile />
				</div>
				{/* summary */}
				<UserBio />
			</div>

			{/* profile Additional details */}
			<AdditionalUserProfile />
			{/* category */}
			<div className="px-4 col-start-5 col-span-2 bg-white lg:shadow-sm lg:rounded-md py-3 mb-6 ">
				<div className=" flex justify-between mr-4 ">
					<h1 className=" font-bold text-gray-900 ">Your Category</h1>
					<button className="flex gap-1">
						<MdEdit className=" text-blue-500" />
						<h3 className="font-bold text-gray-600 hover:text-gray-900 text-xs">
							Edits
						</h3>
					</button>
				</div>
				<div className="flex justify-between py-6 flex-wrap">
					{category.map((category, index) => {
						return (
							<button
								key={index}
								className=" text-sm delay-75 mt-2 mx-2 flex f bg-gray-100 hover:bg-gray-200 rounded-xl  py-[0.35rem] px-4"
							>
								{category}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default ProfileView;
