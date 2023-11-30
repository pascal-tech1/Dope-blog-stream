import React, { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoIosMenu } from "react-icons/io";
import { BsPencilSquare } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";

import { Link, useNavigate } from "react-router-dom";
import {
	clearSinglesliceState,
	setIsEditingPost,
	setPostToBeEdited,
} from "../redux/post/singlePostSlice";
import { useDispatch, useSelector } from "react-redux";
import UserDashboardMenu from "./UserDashboardMenu";
import { setSearchTermInStore } from "../redux/user/userSlice";

const DashboardNavBAr = ({ toggleSideMenu, action }) => {
	const navigate = useNavigate();

	const [searchTerm, setSearchTerm] = useState("");
	const [isSideBarMenuopen, setIsSideBarmenuOpen] = useState(true);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user } = useSelector((store) => store.userSlice);
	const dispatch = useDispatch();
	const handleOnclick = (e) => {
		e.preventDefault();
		setIsSideBarmenuOpen(!isSideBarMenuopen);
		toggleSideMenu(isSideBarMenuopen);
	};

	useEffect(() => {
		// Create a timer variable to store the timeout ID
		let timer;

		// Define the debounced search function
		const debouncedSearch = () => {
			dispatch(setSearchTermInStore(searchTerm));
		};

		// Clear the previous timer to avoid multiple simultaneous searches
		clearTimeout(timer);

		// Set a new timer for the debounce effect
		timer = setTimeout(debouncedSearch, 800);

		// Cleanup function to clear the timer if component unmounts or searchTerm changes
		return () => clearTimeout(timer);
	}, [searchTerm]);

	const handleInputChange = (event) => {
		const newSearchTerm = event.target.value;
		setSearchTerm(newSearchTerm);
	};

	return (
		<div className=" flex my-1 w-full bg-opacity-0 backdrop-blur top-0 right-0 justify-around  z-50 items-center relative">
			{isMenuOpen && (
				<div className=" ">
					<UserDashboardMenu
						isMenuOpen={isMenuOpen}
						setIsMenuOpen={setIsMenuOpen}
					/>
				</div>
			)}
			<FiMenu
				onClick={handleOnclick}
				className=" text-xl ml-6  text-gray-900"
			/>

			<input
				className=" w-1/2 outline-none mx-6 text-center border border-gray-200  transition-all rounded-lg focus:border-b-blue-400 placeholder:text-gray-400"
				type="text"
				id="searchInput"
				placeholder="Search"
				value={searchTerm}
				onChange={handleInputChange}
			/>
			<div className="flex space-x-3 mr-2 items-center ">
				<h3 className=" hidden md:flex text-xs border-l pl-4  pr-1">
					Hello, {user?.lastName}
				</h3>
				<Link
					onClick={(e) => {
						e.preventDefault();
						dispatch(setPostToBeEdited(null));
						dispatch(setIsEditingPost(false));
						dispatch(clearSinglesliceState("success"));
						navigate("/post-Create");
					}}
					to={"/dashboard/post"}
					className=" flex hover:border-gray-300 place-items-center gap-[0.3rem] border border-blue-300 px-1 py-1 md:px-2 rounded-md hover:bg-gray-100 transition-all"
				>
					<BsPencilSquare className=" text-inherit" />
					<h3 className="hidden md:flex text-xs">new</h3>
				</Link>
				<div
					onClick={() => setIsDropdownOpen(true)}
					className=" rounded-full w-6 h-6 text-blue-400 "
				>
					<img
						src={user?.profilePhoto}
						alt=""
						className=" rounded-full h-full w-full "
					/>
				</div>
				<div
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className=" p-1 rounded-full hover:cursor-pointer hover:bg-gray-400  transition-all delay-75 hover:text-white"
				>
					<CiMenuKebab />
				</div>
			</div>
		</div>
	);
};

export default DashboardNavBAr;
