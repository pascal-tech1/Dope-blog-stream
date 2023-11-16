import React, { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsPencilSquare } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineArrowDropDown, MdOutlineSearch } from "react-icons/md";
import { logOutUser } from "../redux/user/userSlice.js";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import {
	fetchPostByCategory,
	setFirstSearch,
} from "../redux/post/allPostSlice.js";

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
		<div className="fixed top-0 w-full border-b bg-white bg-opacity-20 backdrop-blur z-50">
			<div className=" flex justify-between my-2 mx-4 md:mx-10 items-center lg:ml-20">
				<Link to="/" className=" border">
					<img
						src="../../public/blogvana.png"
						alt=""
						className="w-8 md:w-14 border border-blue-400"
					/>
				</Link>
				<form
					onSubmit={formik.handleSubmit}
					className="relative w-1/3 justify-center  items-center"
				>
					<input
						className=" px-1 font-sm py-1  border rounded-lg border-blue-200 text-center focus:outline-none focus:border-blue-400  w-full bg-transparent "
						type="search"
						name="search"
						id="seearch"
						placeholder="Search"
						value={formik.values.search}
						onChange={formik.handleChange("search")}
					/>
				</form>
				{user ? (
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
										src={user?.profilePhoto}
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
							<Link
								to="/stats"
								className="bg-blue-400 px-2 rounded-md text-white hover:shadow-md transition-all hover:bg-blue-300"
							>
								User Profile
							</Link>
							<button
								onClick={handleLogOut}
								className="bg-red-500 px-2 rounded-md text-white hover:shadow-md transition-all hover:bg-red-400"
							>
								Log Out
							</button>
						</div>
						<Link
							to="/post-Create"
							className=" mr-4 text-xs md:text-sm flex hover:border-gray-300 place-items-center gap-[0.3rem] border border-blue-200 px-1 py-1 md:px-2 rounded-md hover:bg-gray-100 transition-all"
						>
							<BsPencilSquare />
							<h3 className=" hidden md:flex">write</h3>
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
