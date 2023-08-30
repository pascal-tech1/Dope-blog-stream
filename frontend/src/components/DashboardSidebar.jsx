import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { AiOutlineComment } from "react-icons/ai";
import { BiMessageDetail } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import { MdOutlineSignpost } from "react-icons/md";
import { GiShadowFollower } from "react-icons/gi";
import { IoMdArrowDropdown } from "react-icons/io";

const DashboardSideBar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState({
		profile: false,
		messages: false,
		post: false,
	});

	const toggleMenuOption = (title) => {
		console.log(title);
		setIsMenuOpen((prev) => ({
			...prev,
			[title]: !prev[title],
		}));
	};
	const closeMenuOption = () => {
		setIsMenuOpen((prev) => ({
			...prev,
			messages: false,
			post: false,
			profile: false,
		}));
	};
	const closeMenu = (title) => {
		setIsMenuOpen((prev) => ({
			...prev,
		}));
	};
	const sideBarItems = [
		{
			title: "dashboard",
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
		{ title: "post", icon: "MdOutlineSignpost" },
		{ title: "followers", icon: "GiShadowFollower" },
		{
			title: "messages",
			icon: "BiMessageDetail",
			menuOpen: isMenuOpen.messages,
			hasSubMenu: true,
			submenu: [
				{
					title: "view",
				},
				{
					title: "Send",
				},
			],
		},
		{ title: "comments", icon: "AiOutlineComment" },
	];

	return (
		<aside className=" flex flex-col  mb-4 font-medium">
			<div className=" hidden md:flex font-bold text-blue-400 p-3  mx-2 pl-3 pt-4 text-xl">
				<h1>Dope blog</h1>
			</div>
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
					default:
						IconComponent = AiOutlineComment; // Default icon
				}
				return (
					<div className=" flex gap-3 ml-5 pr-2 mt-3">
						{sideBarItem.hasSubMenu ? (
							<div className="flex flex-col">
								<div
									onClick={() => {
										toggleMenuOption(sideBarItem.title);
									}}
									className="  flex gap-2 items-center pl-[0.35rem] cursor-pointer py-2 w-full rounded-lg"
								>
									<IconComponent className="text-blue-400 text-lg" />
									<span className=" ">{sideBarItem.title}</span>
									<IoMdArrowDropdown />
								</div>

								{sideBarItem.submenu?.map((submenuItem) => {
									return (
										<NavLink
											onClick={() => {
												closeMenu(sideBarItem.title);
											}}
											to={`${sideBarItem.title}-${submenuItem?.title}`}
											className={`${
												sideBarItem.menuOpen ? "flex" : "hidden"
											}  flex mt-1 ml-4 py-1 px-5 hover:text-white hover:bg-blue-400  w-max aria-[current=page]:text-white rounded-lg aria-[current=page]:bg-blue-400`}
										>
											<h3 className="">{submenuItem.title}</h3>
										</NavLink>
									);
								})}
							</div>
						) : (
							<NavLink
								onClick={() => {
									closeMenuOption();
								}}
								to={sideBarItem.title}
								className="flex gap-2 items-center  pl-[0.35rem] hover:text-white hover:bg-blue-400 py-2 w-full rounded-lg aria-[current=page]:text-white aria-[current=page]:bg-blue-400"
							>
								<IconComponent className="  text-lg "></IconComponent>
								<span className=" font-inter font-bold">
									{sideBarItem.title}
								</span>
							</NavLink>
						)}
					</div>
				);
			})}
		</aside>
	);
};

export default DashboardSideBar;
