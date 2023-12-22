import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { AiOutlineComment } from "react-icons/ai";
import { BiMessageDetail } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import {
	MdOutlineAdminPanelSettings,
	MdOutlineArrowDropDown,
	MdOutlineArrowDropUp,
	MdOutlineSignpost,
} from "react-icons/md";
import { GiShadowFollower } from "react-icons/gi";
import { useSelector } from "react-redux";

const DashboardSideBar = () => {
	const { user } = useSelector((store) => store.userSlice);
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
					title: "View",
				},
				{
					title: "Message",
				},
				{
					title: "Profile Views",
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
	];

	const AdminObject = {
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
	};

	user?.isAdmin && sideBarItems.push(AdminObject);

	return (
		<aside className=" flex flex-col  font-medium font-inter md:h-[95vh] h-[85vh] overflow-y-auto custom-scrollbar   ">
			<Link to="/" className="mt-4 self-center md:flex">
				<img
					src="/blogvana.png"
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
						case "MdOutlineAdminPanelSettings":
							IconComponent = MdOutlineAdminPanelSettings;
							break;
						default:
							IconComponent = AiOutlineComment; // Default icon
					}
					return (
						<div
							key={index}
							className=" flex justify-start items-center px-6 mt-4  text-lg md:text-base "
						>
							{sideBarItem.hasSubMenu ? (
								<div className="flex flex-col">
									<div
										onClick={() => {
											toggleMenuOption(sideBarItem.title);
										}}
										className=" hover:bg-blue-400 hover:text-white  flex items-center gap-2  pl-[0.35rem] cursor-pointer py-[0.2rem] rounded-lg"
									>
										<IconComponent className=" text-lg" />
										<h1 className=" ">{sideBarItem.title}</h1>

										{isMenuOpen[sideBarItem.title] ? (
											<MdOutlineArrowDropUp className=" text-center" />
										) : (
											<MdOutlineArrowDropDown className=" text-center" />
										)}
									</div>

									<div className=" flex flex-col items-start ml-2 border-l dark:border-l-gray-800 justify-start ">
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
													}  flex mt-1   py-[0.2rem] px-2 hover:text-white hover:bg-blue-400   w-max aria-[current=page]:text-white rounded-lg aria-[current=page]:bg-blue-400`}
												>
													<h1 className=" ">{submenuItem.title}</h1>
												</NavLink>
											);
										})}
									</div>
								</div>
							) : (
								<NavLink
									to={sideBarItem.title}
									className="flex gap-2 items-center px-2  pl-[0.35rem] hover:text-white hover:bg-blue-400 py-[0.2rem] w-full rounded-lg aria-[current=page]:text-white aria-[current=page]:bg-blue-400"
								>
									<IconComponent className="  " />

									<h1 className=" font-inter  ">{sideBarItem.title}</h1>
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
