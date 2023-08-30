import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { AiOutlineComment } from "react-icons/ai";
import { BiMessageDetail } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import { MdOutlineSignpost } from "react-icons/md";
import { GiShadowFollower } from "react-icons/gi";


export const sideBarItems = [
		{
			title: "dashboard",
			icon: "LuLayoutDashboard",
		},
		{
			title: "profile",
			icon: "CiUser",
			menuOpen: isMenuOpen.profile,
			hasSubMenu : true,
			submenu: [
				{
					title: "view",
				},
				{
					title: "Edit",
				},
				{
					title: "Game",
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



