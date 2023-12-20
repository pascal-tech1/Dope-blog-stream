import React, { useEffect, useRef, useState } from "react";

import { BsPencilSquare } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import {
	MdOutlineAppRegistration,
	MdOutlineArrowDropDown,
	MdOutlineArrowDropUp,
} from "react-icons/md";
import { logOutUser } from "../redux/user/userSlice.js";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import {
	fetchPostByCategory,
	setFirstSearch,
} from "../redux/post/allPostSlice.js";
import LazyLoadImg from "./LazyLoadImg.jsx";
import { FiLogOut, FiUser } from "react-icons/fi";

import { LuLogIn } from "react-icons/lu";
import useClickOutside from "../customHooks/useClickOutside.js";

import { Theme } from "../components";
import { BiSearch } from "react-icons/bi";
import { useSearchWithDebounce } from "../customHooks/SearchWithDebounce.js";

const NavBar = () => {
	const user = useSelector((store) => store?.userSlice.user);
	const [showLogOut, setShowLogOut] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogOut = () => {
		dispatch(logOutUser("user"));
	};

	const { searchTerm, handleInputChange } = useSearchWithDebounce();

	// using custom hook to close the open UserDashboardMenu
	const divRef = useRef();
	const iconRef = useRef();
	const isOutsideClicked = useClickOutside(divRef, iconRef);

	useEffect(() => {
		showLogOut && !isOutsideClicked && setShowLogOut(false);
	}, [isOutsideClicked]);

	return (
		<div className=" flex w-full font-inter items-center justify-between border-b   dark:border-b-slate-800 gap-4 dark:bg-[#171717] px-4 md:px-8 dark:text-slate-200 py-3">
			<Link to="/" className="">
				<img
					src="/blogvana.png"
					alt=""
					className="w-[2.5rem] border border-blue-400"
				/>
			</Link>

			<form className="relative md:w-1/3 justify-center z-50  items-center">
				<input
					className={` hidden md:flex text-xs  px-1 font-sm py-[0.1rem] border-b dark:border-b-slate-600  rounded-lg border-blue-200 text-center focus:outline-none focus:border-blue-400  w-full bg-transparent `}
					type="text"
					id="searchInput"
					placeholder="Search"
					value={searchTerm}
					onChange={handleInputChange}
				/>
			</form>

			{/* theme  */}
			<div className="">
				<Theme />
			</div>
			<div className={``}>
				{/* user */}
				{user ? (
					<div className=" flex gap-3 md:gap-4 place-items-center">
						<button
							ref={iconRef}
							onClick={() => setShowLogOut(!showLogOut)}
							className="flex items-center"
						>
							<div className=" flex items-center">
								{/* lazyloading */}
								<div>
									<LazyLoadImg
										backgroundClassName={
											" rounded-full w-8 h-8  relative border border-blue-400  "
										}
										imgClassName={
											"absolute inset-0 w-full h-full  object-cover rounded-full "
										}
										originalImgUrl={user?.profilePhoto}
										blurImageStr={user?.blurProfilePhoto}
										optimizationStr={"q_auto,f_auto,w_100"}
										paddingBottom={"100%"}
									/>
								</div>
								{showLogOut ? (
									<MdOutlineArrowDropDown className="text-blue-400 transition-all" />
								) : (
									<MdOutlineArrowDropUp className="text-blue-400 transition-all " />
								)}
							</div>
						</button>

						<div
							ref={divRef}
							className={`${
								showLogOut ? "" : "hidden"
							} flex flex-col  absolute drop-shadow-lg text-lg md:text-base h-[30vh] gap-4 ]  top-12 z-50 right-[0.5rem] md:right-20 border dark:border-slate-700 bg-slate-50 rounded-md px-6 py-6  transition-all dark:bg-[#171717] `}
						>
							<Link
								to="/stats"
								className="bg-blue-400 flex gap-2 items-center  px-1 rounded-md  text-slate-100 hover:shadow-md transition-all hover:bg-blue-600"
							>
								<FiUser />
								Profile
							</Link>
							<button
								onClick={handleLogOut}
								className="bg-red-500 flex gap-2 items-center px-1 rounded-md text-white hover:shadow-md transition-all hover:bg-red-600"
							>
								<FiLogOut />
								Log Out
							</button>
						</div>
						<Link
							to="/post-Create"
							className="  text-xs md:text-sm flex hover:border-gray-300 dark:hover:bg-gray-700 place-items-center gap-[0.3rem] border border-blue-200 px-1 py-1 md:px-2 rounded-md hover:bg-gray-100 transition-all"
						>
							<BsPencilSquare className=" text-2xl text-blue-400" />
							<h3 className=" hidden md:flex text-blue-400">write</h3>
						</Link>
					</div>
				) : (
					<div className="flex gap-4">
						<Link
							to="/login"
							className=" flex gap-2 items-center bg-blue-400 text-white  py-[0.1rem] px-2 rounded-lg   hover:bg-blue-600 transition-all"
						>
							<LuLogIn className="hidden md:flex" />
							login
						</Link>
						<Link
							to="/register"
							className="bg-red-400 flex gap-2 items-center  text-white py-[0.1rem] px-2 rounded-lg  hover:bg-red-500 transition-all"
						>
							<MdOutlineAppRegistration className="hidden md:flex" />
							Register
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default NavBar;
