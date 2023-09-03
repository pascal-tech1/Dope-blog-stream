import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
	MdEdit,
	MdOutlineEmail,
	MdOutlineLanguage,
	MdOutlineVerifiedUser,
	MdOutlineDateRange,
	MdOutlineLocationOn,
} from "react-icons/md";
import {} from "react-icons/md";
const ProfileView = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((store) => store.userSlice);
	console.log(user);
	return (
		<div className=" flex flex-col gap-6 lg:grid grid-cols-6 ml-8 mr-8 font-inter mt-20">
			<div className=" col-start-1 col-span-4 pr-10">
				<div className="w-full relative pb-6 shadow-sm" >
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
						className="absolute top-1/3 left-8 w-16 h-16 rounded-full"
					/>
					<div className=" relative flex flex-col gap-2 items-center mt-4">
						<h1 className=" font-bold text-xs md:text-lg">{`${user?.firstName} ${user?.lastName}`}</h1>
						<h3 className=" font-bold text-gray-500 text-xs">{`Profession : ${user?.profession}`}</h3>
						<h3 className="font-bold text-gray-500 text-xs">{`Location : ${user?.location}`}</h3>
						<Link className="absolute top-0 right-3 flex items-center text-sm ">
							<MdEdit className=" text-blue-500" />
							<h3 className="font-bold text-gray-600 hover:text-gray-900 text-xs">
								Edits
							</h3>
						</Link>
					</div>
				</div>
				<div className=" py-8 px-8 shadow-sm rounded-xl">
					<h1 className=" font-bold text-gray-900 mb-4 ">Summary</h1>
					<p>
						Lorem ipsum dolor sit amet consectetur, adipisicing elit.
						Exercitationem, illo nemo! Harum quae architecto mollitia cum
						saepe dolore sequi quibusdam iste numquam nobis vel maiores id,
						qui sit incidunt tempore error, magni nulla eveniet velit
						cupiditate suscipit blanditiis! Id.
					</p>
				</div>
			</div>
			{/* profile Additional details */}
			<div className=" shadow-sm col-start-5 col-span-2 px-4">
				<div className=" flex justify-between mr-4s ">
					<h1 className=" font-bold text-gray-900 ">Additional Details</h1>
					<Link className="border border-blue-400 hover:bg-blue-400 hover:text-white  px-2 rounded-md ">
						Edit
					</Link>
				</div>
				<div className="flex flex-col gap-8 mt-5">
					<div className=" flex gap-3 items-center">
						<MdOutlineEmail className=" text-gray-400 font-medium text-xl" />
						<div>
							<h2 className=" text-gray-400">Email</h2>
							<h3 className=" text-blue-400 text-xs">{user.email}</h3>
						</div>
					</div>
					<div className=" flex gap-3 items-center">
						<MdOutlineEmail className=" text-gray-400 font-medium text-lg" />
						<div>
							<h2 className=" text-gray-400">Email</h2>
							<h3 className=" text-blue-400 text-xs">{user.email}</h3>
						</div>
					</div>
					<div className=" flex gap-3 items-center">
						<MdOutlineEmail className=" text-gray-400 font-medium text-lg" />
						<div>
							<h2 className=" text-gray-400">Email</h2>
							<h3 className=" text-blue-400 text-xs">{user.email}</h3>
						</div>
					</div>
					<div className=" flex gap-3 items-center">
						<MdOutlineEmail className=" text-gray-400 font-medium text-lg" />
						<div>
							<h2 className=" text-gray-400">Email</h2>
							<h3 className=" text-blue-400 text-xs">{user.email}</h3>
						</div>
					</div>
					<div className=" flex gap-3 items-center">
						<MdOutlineEmail className=" text-gray-400 font-medium text-lg" />
						<div>
							<h2 className=" text-gray-400">Email</h2>
							<h3 className=" text-blue-400 text-xs">{user.email}</h3>
						</div>
					</div>
				</div>
			</div>
			<div className=" shadow-sm  mx-10 px-4 col-start-5 col-span-2">
				user category
			</div>
		</div>
	);
};

export default ProfileView;
