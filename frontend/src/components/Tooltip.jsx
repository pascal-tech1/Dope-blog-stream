import React from "react";

const Tooltip = ({ info, children }) => {
	return (
		<div className="flex w-full hover:cursor-pointer relative">
			<div className="group w-max overflow-hidden ">
				<div className="">
					<h3 className=" px-1">{children}</h3>
				</div>
				<div className=" ">
					<div className=" rounded-lg z-[500] group-hover:bg-black group-hover:opacity-80 border border-blue-400 pointer-events-none  -top-7 left-0 opacity-0 transition-opacity text-white px-1 backdrop-blur-md absolute py-1">
						{info}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Tooltip;
