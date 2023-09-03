import React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import { DashboardSideBar, DashboardNavBAr } from "../../components";

const Layout = () => {
	const [isDrpDownOpen, setIsDropDownOpen] = useState(false);

	const handleToggleSideBarMenu = (data) => {
		setIsDropDownOpen(data);
	};
	return (
		<div className="grid grid-cols-12 gap-8 font-inter font-extralight  text-sm text-gray-600 relative bg-[#f6f6f6] ">
			<div className=" md:col-start-3 col-span-full row-start-1 md:relative ">
				<DashboardNavBAr toggleSideMenu={handleToggleSideBarMenu} />
				<Outlet />
			</div>
			<section
				className={`${
					isDrpDownOpen ? "hidden md:flex" : ""
				}   absolute bg-[#ffff]  w-max h-max -top-6 md:ml-0 mt-16 md:mt-0 col-start-1 col-span-2 md:h-screen min-w-full shadow-sm row-start-1`}
			>
				<DashboardSideBar />
			</section>
		</div>
	);
};

export default Layout;
