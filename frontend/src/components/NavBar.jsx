import React, { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsPencilSquare } from "react-icons/bs";
import { Link } from "react-router-dom";
import { MdOutlineArrowDropDown } from "react-icons/md";

import { useSelector } from "react-redux";

const NavBar = () => {
	const user = useSelector((store) => store?.userSlice);
	const [showLogOut, setShowLogOut] = useState(true);
	return (
		<div className="fixed top-0 w-full border-b bg-white bg-opacity-20 backdrop-blur z-50">
			<div className=" flex justify-between my-2 mx-4 md:mx-10 items-center lg:ml-20">
				<Link to="/" className=" border">
					<img
						src="blogvana.png"
						alt=""
						className="w-8 md:w-14 border border-blue-400"
					/>
				</Link>
				<input
					className=" font-sm  border rounded-lg border-blue-200 text-center focus:outline-none focus:border-blue-400 w-1/3 justify-center bg-transparent items-center"
					type="search"
					name="search"
					id="seearch"
					placeholder="Search"
				/>
				{user?.user?.token ? (
					<div className=" flex place-content-between gap-1 md:gap-4 place-items-center">
						<IoMdNotificationsOutline className="text-2xl md:text-3xl antialiased text-blue-400" />
						<button
							onClick={() => setShowLogOut(!showLogOut)}
							className="flex items-center"
						>
							<div className=" flex items-center">
								<div className="border border-blue-400 rounded-full py-1 px-1 ">
									<img
										className=" w-6 h-6 md:w-8 md:h-8 rounded-full"
										src="person.png"
										alt=""
									/>
								</div>
								<MdOutlineArrowDropDown className="text-blue-400 transition-alls" />
							</div>
						</button>
						<div
							className={`${
								showLogOut ? "hidden" : ""
							} flex flex-col gap-3 absolute top-14 z-50 right-11 md:right-20 border bg-slate-50 rounded-md px-6 py-6  transition-all`}
						>
							<Link to='/dashboard/dashboard' className="bg-blue-400 px-2 rounded-md text-white hover:shadow-md transition-all hover:bg-blue-300">
								User Profile
							</Link>
							<button className="bg-red-500 px-2 rounded-md text-white hover:shadow-md transition-all hover:bg-red-400">
								Log Out
							</button>
							
						</div>
						<Link
							to="/dashboard/post"
							className=" text-xs md:text-sm flex hover:border-gray-300 place-items-center gap-[0.3rem] border border-blue-200 px-1 py-1 md:px-2 rounded-md hover:bg-gray-100 transition-all"
						>
							<BsPencilSquare />
							<h3>write</h3>
						</Link>
					</div>
				) : (
					<div className="mr-4">
						<Link
							to="/login"
							className=" bg-blue-400 py-1 px-4 rounded-lg mr-4 text-white hover:bg-blue-300 transition-all"
						>
							Login
						</Link>
						<Link
							to="/register"
							className=" bg-blue-400 py-1 px-4 rounded-lg text-white hover:bg-blue-300 transition-all"
						>
							Register
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default NavBar;
