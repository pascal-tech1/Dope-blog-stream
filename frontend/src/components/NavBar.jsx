import React, { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsPencilSquare } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import {
	MdOutlineAppRegistration,
	MdOutlineArrowDropDown,
	MdOutlineArrowDropUp,
	MdOutlineArrowUpward,
	MdOutlineSearch,
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
import { FiLogIn, FiLogOut, FiUser } from "react-icons/fi";
import { CiLogin, CiMenuKebab } from "react-icons/ci";
import { BiHome, BiLogIn, BiLogInCircle, BiRegistered } from "react-icons/bi";
import { LuLogIn, LuLogOut } from "react-icons/lu";

const NavBar = () => {
	const user = useSelector((store) => store?.userSlice.user);
	const [showLogOut, setShowLogOut] = useState(true);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogOut = () => {
		dispatch(logOutUser("user"));
	};
	const formSchema = Yup.object().shape({
		search: Yup.string().required("Search is Required."),
	});

	const formik = useFormik({
		initialValues: {
			search: "",
		},

		onSubmit: (values, { resetForm }) => {
			dispatch(setFirstSearch(values.search));
			navigate("/");
			resetForm();
			dispatch(fetchPostByCategory());
		},
		validationSchema: formSchema,
	});
	return (
		<div className=" flex justify-between w-full items-center gap-1  border-b  dark:border-b-slate-800 flex-wrap dark:bg-[#171717] px-4 md:px-8 dark:text-slate-200">
			<Link to="/" className="">
				<img
					src="../../public/blogvana.png"
					alt=""
					className="w-10 border border-blue-400 my-1"
				/>
			</Link>

			<form
				onSubmit={formik.handleSubmit}
				className="relative w-1/3 justify-center  items-center"
			>
				<input
					className=" text-xs md:text-base px-1 font-sm py-[0.1rem] border-b dark:border-b-slate-600  rounded-lg border-blue-200 text-center focus:outline-none focus:border-blue-400  w-full bg-transparent "
					type="search"
					name="search"
					id="seearch"
					placeholder="Search"
					value={formik.values.search}
					onChange={formik.handleChange("search")}
				/>
			</form>
			{user ? (
				<div className=" flex gap-1 md:gap-4 place-items-center">
					<button
						onClick={() => setShowLogOut(!showLogOut)}
						className="flex items-center"
					>
						<div className=" flex items-center">
							{/* lazyloading */}
							<div>
								<LazyLoadImg
									backgroundClassName={
										" rounded-full w-6 h-6  relative border border-blue-400  "
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
						className={`${
							showLogOut ? "hidden" : ""
						} flex flex-col gap-3 absolute drop-shadow-lg  top-12 z-50 right-11 md:right-20 border dark:border-slate-700 bg-slate-50 rounded-md px-6 py-6  transition-all dark:bg-[#171717] `}
					>
						<Link
							to="/stats"
							className="bg-blue-400 flex gap-2 items-center  px-1 rounded-md text-white hover:shadow-md transition-all hover:bg-blue-600"
						>
							<FiUser />
							Profile
						</Link>
						<button
							onClick={handleLogOut}
							className="bg-red-400 flex gap-2 items-center px-1 rounded-md text-white hover:shadow-md transition-all hover:bg-red-600"
						>
							<FiLogOut />
							Log Out
						</button>
					</div>
					<Link
						to="/post-Create"
						className="  text-xs md:text-sm flex hover:border-gray-300 dark:hover:bg-gray-700 place-items-center gap-[0.3rem] border border-blue-200 px-1 py-1 md:px-2 rounded-md hover:bg-gray-100 transition-all"
					>
						<BsPencilSquare />
						<h3 className=" hidden md:flex">write</h3>
					</Link>
				</div>
			) : (
				<div className="flex gap-4">
					<Link
						to="/login"
						className=" flex gap-2 items-center bg-blue-400 text-white  py-[0.15rem] px-2 rounded-lg   hover:bg-blue-600 transition-all"
					>
						<LuLogIn  className="hidden md:flex"/>
						login
					</Link>
					<Link
						to="/register"
						className="bg-red-400 flex gap-2 items-center  text-white py-[0.15rem] px-2 rounded-lg  hover:bg-red-500 transition-all"
					>
						<MdOutlineAppRegistration className="hidden md:flex"/>
						Register
					</Link>
				</div>
			)}
		</div>
	);
};

export default NavBar;
