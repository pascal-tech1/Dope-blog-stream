import React from "react";

const Tooltip = ({ info, children }) => {
	return (
		<div className="flex w-full hover:cursor-pointer relative font-inter">
			<div className="group w-max overflow-hidden ">
				<div className="">
					<div className=" px-1">{children}</div>
				</div>
				<div className=" ">
					<div className=" rounded-lg group-hover:bg-black  group-hover:opacity-80 border border-blue-400 pointer-events-none  -top-7 left-0 opacity-0 transition-opacity text-white px-1 group-hover:backdrop-blur-md absolute py-1">
						{info}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Tooltip;
