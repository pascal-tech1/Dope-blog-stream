import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsPencilSquare } from "react-icons/bs";
import { BiMessageRoundedDots } from "react-icons/bi";
import { Link } from "react-router-dom";
import {
	setIsEditingPost,
	setPostToBeEdited,
} from "../redux/post/singlePostSlice";
import { useDispatch } from "react-redux";

const DashboardNavBAr = ({ toggleSideMenu }) => {
	const [isSideBarMenuopen, setIsSideBarmenuOpen] = useState(true);
	const dispatch = useDispatch();
	const handleOnclick = (e) => {
		e.preventDefault();
		setIsSideBarmenuOpen(!isSideBarMenuopen);
		toggleSideMenu(isSideBarMenuopen);
	};

	return (
		<div className=" flex justify-between my-1 w-full bg-opacity-0 backdrop-blur top-0 right-0 z-50 ">
			<FiMenu
				onClick={handleOnclick}
				className=" text-xl ml-6  text-gray-900"
			/>
			<input
				type="search"
				name="search"
				id="search"
				placeholder="search"
				className=" w-1/2 outline-none mx-6 text-center border border-gray-200  transition-all rounded-lg focus:border-b-blue-400 placeholder:text-gray-400"
			/>
			<div className="flex space-x-3 mr-2 items-center ">
				<IoMdNotificationsOutline className="text-2xl font-bold  text-blue-400" />
				<BiMessageRoundedDots className="text-2xl  font-bold  text-blue-400" />
				<h3 className=" hidden md:flex text-xs border-l pl-4  pr-1">
					Hello, Onyeka
				</h3>
				<Link
					onClick={(e) => {
						console.log(e);
						e.preventDefault();
						dispatch(setPostToBeEdited(null));
						dispatch(setIsEditingPost(false));
					}}
					to={"/dashboard/post"}
					className=" flex hover:border-gray-300 place-items-center gap-[0.3rem] border border-blue-300 px-1 py-1 md:px-2 rounded-md hover:bg-gray-100 transition-all"
				>
					<BsPencilSquare className=" text-inherit" />
					<h3 className="hidden md:flex text-xs">new</h3>
				</Link>
				<img
					src="../../public/person.png"
					alt=""
					className=" w-8 h-8  rounded-full mr-4"
				/>
			</div>
			{/* <h3 className=" border-l pl-4  pr-1 md:hidden">Hello, Onyeka</h3>
				<img
					src="../../public/person.png"
					alt=""
					className=" w-8 h-8  rounded-full mr-4"
				/> */}
		</div>
	);
};

export default DashboardNavBAr;
