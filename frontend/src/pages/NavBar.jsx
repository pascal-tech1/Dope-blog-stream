import React from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";
import { BsPencilSquare } from "react-icons/bs";
const NavBar = () => {
	return (
		<div className="fixed top-0 w-full border-b bg-white bg-opacity-20 backdrop-blur">
			<div className=" flex justify-between my-4 mx-10">
				<FiMenu  className=" text-3xl"/>
				<h2 className=" font-sans font-bold antialiased">READER</h2>
				<div className=" flex place-content-between gap-3 md:gap-4 place-items-center">
					<IoMdNotifications className=" text-2xl md:text-3xl antialiased" />
					<img
						className=" w-6 h-6 md:w-8 md:h-8 rounded-full"
						src="avatar.jpg"
						alt=""
					/>
					<button className=" flex hover:border-gray-300 place-items-center gap-[0.3rem] border border-blue-200 px-1 py-1 md:px-2 rounded-md hover:bg-gray-100 transition-all">
						<BsPencilSquare />
						<h3>write</h3>
					</button>
				</div>
			</div>
			
		</div>
	);
};

export default NavBar;
