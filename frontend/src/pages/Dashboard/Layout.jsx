import React, { useEffect } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

import {
	DashboardSideBar,
	DashboardNavBAr,
	ChangeEmailForm,
	Modal,
} from "../../components";
import { useSelector } from "react-redux";

const Layout = () => {
	const { token, user } = useSelector((store) => store.userSlice);

	if (!token) {
		return <Navigate to="/login" />;
	}

	const [isDrpDownOpen, setIsDropDownOpen] = useState(false);

	const handleToggleSideBarMenu = (data) => {
		setIsDropDownOpen(data);
	};
	useEffect(() => {
		const handleKeyPress = (e) => {
			if (e.key === "B") {
				setIsDropDownOpen(!isDrpDownOpen);
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [isDrpDownOpen]);

	return (
		<div className=" overflow-hidden">
			<section className="dashboardLayout grid-cols-12 bg-gray-50  h-screen overflow-y-hidden  dark:bg-[#1C1C1C] dark:text-slate-300  ">
				<ChangeEmailForm />

				<div
					className={`${
						isDrpDownOpen
							? "md:col-start-3  col-start-1"
							: " col-start-1 md:col-start-1"
					}  col-span-full row-start-1 row-span-1 `}
				>
					<DashboardNavBAr toggleSideMenu={handleToggleSideBarMenu} />
				</div>

				<div
					className={` ${
						isDrpDownOpen
							? "md:col-start-3 col-start-1"
							: " col-start-1 md:col-start-1 "
					}  col-span-full row-start-2 overflow-y-auto px-4 md:px-8 scroll-m-0 z-10 scroll-smooth  custom-scrollbar  `}
				>
					<Outlet />
				</div>
				<div
					className={`${
						isDrpDownOpen
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
