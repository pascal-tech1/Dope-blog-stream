import React, { useEffect } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import {
	DashboardSideBar,
	DashboardNavBAr,
	ChangeEmailForm,
	Modal,
} from "../../components";

const Layout = () => {
	const [isDrpDownOpen, setIsDropDownOpen] = useState(true);

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
		<section className="dashboardLayout grid-cols-12 lg:bg-gray-50   ">
			<ChangeEmailForm />

			<div
				className={`${
					isDrpDownOpen
						? "md:col-start-3  col-start-1"
						: " col-start-1 md:col-start-1"
				}  col-span-full row-start-1 row-span-1 md:px-2`}
			>
				<DashboardNavBAr toggleSideMenu={handleToggleSideBarMenu} />
			</div>

			<div
				className={` ${
					isDrpDownOpen
						? "md:col-start-3 col-start-1"
						: " col-start-1 md:col-start-1 "
				}  col-span-full row-start-2 overflow-y-auto px-4 md:px-8 scroll-m-0 scroll-smooth  custom-scrollbar  `}
			>
				<Outlet />
			</div>
			<div
				className={`${
					isDrpDownOpen
						? "absolute top-7 md:top-0  md:relative "
						: "hidden "
				}    md:col-start-1 col-span-2 row-start-1 row-span-2 h-screen z-[50] overflow-y-auto custom-scrollbar bg-white drop-shadow-sm rounded-md px-2   `}
			>
				<DashboardSideBar />
			</div>
		</section>
	);
};

export default Layout;
