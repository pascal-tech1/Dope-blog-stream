import React from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";
import { BsPencilSquare } from "react-icons/bs";
const NavBar = () => {
	return (
		<div className="fixed top-0 left-0">
			<div className="  place-content-between place-items-center sticky ">
				<FiMenu />
				<h2 className=" font-sans font-bold antialiased">READER</h2>
				<div className=" flex place-content-between gap-3 md:gap-4 mr-2 place-items-center">
					<IoMdNotifications className=" text-2xl md:text-3xl antialiased" />
					<img
						className=" w-6 h-6 md:w-8 md:h-8 rounded-full"
						src="../../public/avatar.jpg"
						alt=""
					/>
					<button className=" flex hover:border-gray-300 place-items-center gap-[0.3rem] border border-blue-200 px-1 py-1 md:px-2 rounded-md hover:bg-gray-100 delay-200">
						<BsPencilSquare />
						<h3>write</h3>
					</button>
				</div>
			</div>
			<hr className=" mt-3" />
		</div>
	);
};

export default NavBar;
