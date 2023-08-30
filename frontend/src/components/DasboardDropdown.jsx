import React from "react";
import { useState } from "react";

const DasboardDropdown = () => {
	return (
		<aside className="s md:flex flex-col  space-y-4 mt-16 ">
			{sideBarItems.map((sideBarItem, index) => {
				return (
					<NavLink
						key={index}
						to={sideBarItem.title}
						className="aria-[current=page]:bg-blue-300 aria-[current=page]:text-white mb-6s backdrop-blur-md p-3 text-gray-600  aria-[current=page]:hover:text-white hover:text-white hover:translate-x-1 mx-2 pl-3  transition-all  rounded-md hover:bg-blue-200"
					>
						<div className="flex gap-2  items-center ">
							<img src={sideBarItem.icon} alt="" className=" w-4" />
							<span className=" font-light text-sm">
								{sideBarItem.title}
							</span>
							
						</div>
					</NavLink>
				);
			})}
		</aside>
	);
};

export default DasboardDropdown;
