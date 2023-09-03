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
	const category = ["design", "developtment", "ux", "marketing"];
	return (
		<div className=" flex flex-col row-span-2 lg:grid grid-cols-6 pcol-start-1 col-span-4 rounded-xl mx-4 lg:mb-6 pt-4 lg:shadow-sm lg:rounded-md lg:ml-0  font-inter mt-10 gap-5 bg-white lg:bg-transparent">
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
					<div className=" relative flex flex-col gap-2 items-center mt-4 ">
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
				{/* summary */}
				<div className="  rounded-xl flex flex-col px-4  mt-8">
					<div className=" flex justify-between mr-4 ">
						<h1 className=" font-bold text-gray-900 ">Summary</h1>
						<Link className="flex gap-1">
							<MdEdit className=" text-blue-500" />
							<h3 className="font-bold text-gray-600 hover:text-gray-900 text-xs">
								Edits
							</h3>
						</Link>
					</div>
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
			<div className=" col-start-5 col-span-2 px-4 bg-white py-4 row-start-1 lg:shadow-sm lg:rounded-md">
				<div className=" flex justify-between mr-4 ">
					<h1 className=" font-bold text-gray-900 ">Additional Details</h1>
					<Link className="flex gap-1">
						<MdEdit className=" text-blue-500" />
						<h3 className="font-bold text-gray-600 hover:text-gray-900 text-xs">
							Edits
						</h3>
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
			{/* category */}
			<div className="px-4 col-start-5 col-span-2 bg-white lg:shadow-sm lg:rounded-md py-3 mb-6 ">
				<div className=" flex justify-between mr-4 ">
					<h1 className=" font-bold text-gray-900 ">Your Category</h1>
					<Link className="flex gap-1">
						<MdEdit className=" text-blue-500" />
						<h3 className="font-bold text-gray-600 hover:text-gray-900 text-xs">
							Edits
						</h3>
					</Link>
				</div>
				<div className="flex justify-between py-6 flex-wrap">
					{category.map((category) => {
						return (
							<button className=" text-sm delay-75 mt-2 mx-2 flex f bg-gray-100 hover:bg-gray-200 rounded-xl  py-[0.35rem] px-4">
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
