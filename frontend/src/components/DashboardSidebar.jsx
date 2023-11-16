import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { AiOutlineComment } from "react-icons/ai";
import { BiMessageDetail } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import {
	MdAdminPanelSettings,
	MdOutlineAdminPanelSettings,
	MdOutlineSignpost,
} from "react-icons/md";
import { GiShadowFollower } from "react-icons/gi";
import { IoMdArrowDropdown } from "react-icons/io";

const DashboardSideBar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState({
		profile: false,
		messages: false,
		post: false,
		follows: false,
	});

	const toggleMenuOption = (title) => {
		setIsMenuOpen((prev) => ({
			...prev,
			[title]: !prev[title],
		}));
	};

	const closeMenu = (title) => {
		setIsMenuOpen((prev) => ({
			...prev,
		}));
	};
	const sideBarItems = [
		{
			title: "stats",
			icon: "LuLayoutDashboard",
		},
		{
			title: "profile",
			icon: "CiUser",
			menuOpen: isMenuOpen.profile,
			hasSubMenu: true,
			submenu: [
				{
					title: "view",
				},
				{
					title: "Edit",
				},
			],
		},
		{
			title: "post",
			icon: "MdOutlineSignpost",
			menuOpen: isMenuOpen.post,
			hasSubMenu: true,
			submenu: [
				{
					title: "My Posts",
				},
				{
					title: "Create",
				},
				{
					title: "History",
				},
				{
					title: "Saved",
				},
			],
		},
		{
			title: "follows",
			icon: "BiMessageDetail",
			menuOpen: isMenuOpen.follows,
			hasSubMenu: true,
			submenu: [
				{
					title: "followers",
				},
				{
					title: "following",
				},
			],
		},
		{
			title: "Admin",
			icon: "MdOutlineAdminPanelSettings",
			menuOpen: isMenuOpen.Admin,
			hasSubMenu: true,
			submenu: [
				{
					title: "All Users",
				},
				{
					title: "All Posts",
				},
				{
					title: "Category",
				},
			],
		},

		// {
		// 	title: "messages",
		// 	icon: "BiMessageDetail",
		// 	menuOpen: isMenuOpen.messages,
		// 	hasSubMenu: true,
		// 	submenu: [
		// 		{
		// 			title: "view",
		// 		},
		// 		{
		// 			title: "Send",
		// 		},
		// 	],
		// },
	];

	return (
		<aside className=" flex flex-col  font-medium  h-96  ">
			<Link to="/" className="mt-4 self-center md:flex">
				<img
					src="../../public/blogvana.png"
					alt=""
					className="w-14 border h-14 border-blue-400"
				/>
			</Link>

			<div className="pb-6 self-center max-w-fit   ">
				{sideBarItems.map((sideBarItem, index) => {
					let IconComponent;

					switch (sideBarItem.icon) {
						case "GiShadowFollower":
							IconComponent = GiShadowFollower;
							break;
						case "MdOutlineSignpost":
							IconComponent = MdOutlineSignpost;
							break;
						case "CiUser":
							IconComponent = CiUser;
							break;
						case "BiMessageDetail":
							IconComponent = BiMessageDetail;
							break;
						case "AiOutlineComment":
							IconComponent = AiOutlineComment;
							break;
						case "LuLayoutDashboard":
							IconComponent = LuLayoutDashboard;
							break;
						case "LuLayoutDashboard":
							IconComponent = LuLayoutDashboard;
							break;
						case "MdOutlineAdminPanelSettings":
							IconComponent = MdOutlineAdminPanelSettings;
							break;
						default:
							IconComponent = AiOutlineComment; // Default icon
					}
					return (
						<div key={index} className=" flex justify-center items-center pr-2 mt-3">
							{sideBarItem.hasSubMenu ? (
								<div className="flex flex-col">
									<div
										onClick={() => {
											toggleMenuOption(sideBarItem.title);
										}}
										className=" hover:bg-blue-400 hover:text-white flex gap-2 items-center pl-[0.35rem] cursor-pointer py-2 w-full rounded-lg"
									>
										<IconComponent className=" text-lg" />
										<span className=" ">{sideBarItem.title}</span>
										<IoMdArrowDropdown />
									</div>

									<div className=" flex flex-col items-center justify-start border-l ">
										{sideBarItem.submenu?.map((submenuItem, index) => {
											return (
												<NavLink
													key={index}
													onClick={() => {
														closeMenu(sideBarItem.title);
													}}
													to={`${sideBarItem.title}-${submenuItem?.title}`}
													className={`${
														sideBarItem.menuOpen ? "" : "hidden"
													}  flex mt-1   py-1 px-2 hover:text-white hover:bg-blue-400   w-max aria-[current=page]:text-white rounded-lg aria-[current=page]:bg-blue-400`}
												>
													<h3 className="">{submenuItem.title}</h3>
												</NavLink>
											);
										})}
									</div>
								</div>
							) : (
								<NavLink
									to={sideBarItem.title}
									className="flex gap-2 items-center px-2  pl-[0.35rem] hover:text-white hover:bg-blue-400 py-2 w-full rounded-lg aria-[current=page]:text-white aria-[current=page]:bg-blue-400"
								>
									<IconComponent className="  text-lg "></IconComponent>
									<span className=" font-inter">{sideBarItem.title}</span>
								</NavLink>
							)}
						</div>
					);
				})}
			</div>
		</aside>
	);
};

export default DashboardSideBar;
