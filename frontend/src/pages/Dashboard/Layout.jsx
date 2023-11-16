import React, { useEffect } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import { DashboardSideBar, DashboardNavBAr } from "../../components";

const Layout = () => {
	const [isDrpDownOpen, setIsDropDownOpen] = useState(false);

	const handleToggleSideBarMenu = (data) => {
		setIsDropDownOpen(data);
	};
	useEffect(() => {
		const handleKeyPress = (e) => {
			console.log("i");
			if (e.key === "B") {
				console.log("im here now");
				setIsDropDownOpen(!isDrpDownOpen);
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [isDrpDownOpen]);
	return (
		<section className="dashboardLayout grid-cols-12    ">
			<div
				className={`${
					isDrpDownOpen
						? "md:col-start-3  col-start-1"
						: " col-start-1 md:col-start-1"
				}  col-span-full row-start-1 row-span-1`}
			>
				<DashboardNavBAr toggleSideMenu={handleToggleSideBarMenu} />
			</div>

			<div
				className={` ${
					isDrpDownOpen
						? "md:col-start-3 col-start-1"
						: " col-start-1 md:col-start-1 "
				}  col-span-full row-start-2 overflow-y-auto px-4 md:px-6 scroll-m-0 scroll-smooth  custom-scrollbar  `}
			>
				<Outlet />
			</div>
			<div
				className={`${
					isDrpDownOpen
						? "absolute top-7 md:top-0  md:relative overflow-y-auto"
						: "hidden"
				}    md:col-start-1 col-span-2 row-start-1 row-span-2 h-screen z-50 custom-scrollbar overflow-x-hidden bg-white   `}
			>
				<DashboardSideBar />
			</div>
		</section>
	);
};

export default Layout;
