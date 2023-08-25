import React from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";
import { BsPencilSquare } from "react-icons/bs";
const NavBar = () => {
	return (
		<>
			<div className=" flex place-content-between place-items-center mt-5 ml-4">
				<FiMenu />
				<h2 className=" font-bold antialiased">READER</h2>
				<div className=" flex place-content-between gap-8 mr-4 place-items-center">
					<IoMdNotifications className=" text-3xl antialiased" />
					<img
						className=" w-8 h-8 rounded-full"
						src="../../public/avatar.jpg"
						alt=""
					/>
					<button className=" flex place-items-center gap-2 bg-slate-100 px-3 py-1 rounded-md hover:bg-slate-200 delay-200">
						<BsPencilSquare />
						<h3>write</h3>
					</button>
				</div>
			</div>
            <hr className=" mt-6" />
		</>
	);
};

export default NavBar;
