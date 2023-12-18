import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import {
	DashboardSideBar,
	DashboardNavBAr,
	ChangeEmailForm,
} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useClickOutside, useScreenWidth } from "../../customHooks";
import { setSideBarStateInStore } from "../../redux/category/categorySlice";

const Layout = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const screenWidth = useScreenWidth();

	const { token, user } = useSelector((store) => store.userSlice);
	const { isSideBarOpen } = useSelector((store) => store.categorySlice);

	const divRef = useRef();
	const iconRef = useRef();
	const isOutsideClicked = useClickOutside(divRef, iconRef);

	// using custom hook to close the open sidebarmenu

	useEffect(() => {
		isSideBarOpen &&
			!isOutsideClicked &&
			dispatch(setSideBarStateInStore(false));
	}, [isOutsideClicked]);

	useEffect(() => {
		if (user && !user?.isAccountVerified) {
			navigate("/send-email-verification");
			return;
		}
	}, []);

	useEffect(() => {
		const handleKeyPress = (e) => {
			if (e.key === "B") {
				dispatch(setSideBarStateInStore(!isSideBarOpen));
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [isSideBarOpen]);

	useEffect(() => {
		dispatch(setSideBarStateInStore(screenWidth < 798 ? false : true));
	}, [screenWidth]);

	if (!token) {
		return <Navigate to="/login" />;
	}

	return (
		<div className=" overflow-hidden">
			<section className="dashboardLayout grid-cols-12 bg-gray-50  h-screen overflow-y-hidden  dark:bg-[#1C1C1C] dark:text-slate-300  ">
				<ChangeEmailForm />

				<div
					className={`${
						isSideBarOpen
							? "md:col-start-3  col-start-1"
							: " col-start-1 md:col-start-1"
					}  col-span-full row-start-1 row-span-1 `}
				>
					<DashboardNavBAr refOpt={iconRef} screenWidth={screenWidth} />
				</div>

				<div
					className={` ${
						isSideBarOpen
							? "md:col-start-3 col-start-1"
							: " col-start-1 md:col-start-1 "
					}  col-span-full row-start-2 overflow-y-auto px-4 md:px-8 scroll-m-0 z-10 scroll-smooth  custom-scrollbar  `}
				>
					<Outlet />
				</div>
				<div
					ref={screenWidth <= 798 ? divRef : null}
					className={`${
						isSideBarOpen
							? "absolute top-7 md:top-0  md:relative "
							: "hidden "
					}   col-start-1 col-span-2 row-start-1 row-span-full h-[95vh] md:h-screen  z-10  overflow-y-auto custom-scrollbar bg-white dark:bg-[#171717] drop-shadow-sm rounded-md px-2   `}
				>
					<DashboardSideBar />
				</div>
			</section>
		</div>
	);
};

export default Layout;
