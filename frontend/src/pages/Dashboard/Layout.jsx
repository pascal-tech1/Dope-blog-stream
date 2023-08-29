import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import NavBar from "../NavBar";
import { DashboardSideBar } from "../../components";

const Layout = () => {
	const sideBarItems = [
		{
			title: "dashboard",
			icon: "dashboard.png",
		},

		{ title: "profile", icon: "person.png" },
		{ title: "post", icon: "petition.png" },
		{ title: "followers", icon: "user.png" },

		{ title: "messages", icon: "message.png" },
		{ title: "comments", icon: "feedback.png" },
	];

	return (
		<div className=" md:grid grid-cols-12 grid-rows-1 font-helvetica text-gray-600 relative">
			<section className=" col-start-3 col-span-9   h-screen overflow-hidden">
				<NavBar />
				<Outlet />
			</section>
			<section className=" col-start-1 col-span-2 h-screen  overflow-hidden min-w-full shadow-lg row-start-1 ">
				<DashboardSideBar/>
			</section>
		</div>
	);
};

export default Layout;
