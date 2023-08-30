import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsPencilSquare } from "react-icons/bs";
import { BiMessageRoundedDots } from "react-icons/bi";

const DashboardNavBAr = ({ toggleSideMenu }) => {
	const [isSideBarMenuopen, setIsSideBarmenuOpen] = useState(true);

	const handleOnclick = (e) => {
		e.preventDefault();
		setIsSideBarmenuOpen(!isSideBarMenuopen);
		toggleSideMenu(isSideBarMenuopen);
	};

	return (
		<div className=" text-xs md:text-sm grid  bg-white bg-opacity-20 backdrop-blur">
			<div className=" flex justify-between my-4">
				<FiMenu
					onClick={handleOnclick}
					className=" md:hidden text-xl ml-6  text-gray-900"
				/>
				<input
					type="search"
					name="search"
					id="search"
					placeholder="search"
					className=" w-8/12 outline-none mx-6 text-center border border-gray-200  transition-all rounded-lg focus:border-b-blue-400 placeholder:text-gray-400"
				/>
				<div className="hidden  md:flex space-x-3 mr-4 items-center ">
					<IoMdNotificationsOutline className=" text-4xl font-bold md:text-xl text-blue-400" />
					<BiMessageRoundedDots className="text-4xl font-bold md:text-xl text-blue-400" />
					<h3 className=" border-l pl-4  pr-1">Hello, Onyeka</h3>
					<button className=" flex hover:border-gray-300 place-items-center gap-[0.3rem] border border-blue-300 px-1 py-1 md:px-2 rounded-md hover:bg-gray-100 transition-all">
						<BsPencilSquare className=" text-inherit" />
						<h3 className="text-xs">write</h3>
					</button>
				</div>
				<h3 className=" border-l pl-4  pr-1 md:hidden">Hello, Onyeka</h3>
				<img
					src="../assets/person.png"
					alt=""
					className=" w-8 h-8  rounded-full mr-4"
				/>
			</div>
		</div>
	);
};

export default DashboardNavBAr;
