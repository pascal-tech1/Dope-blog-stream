import React from "react";

const Tooltip = ({ info, children }) => {
	return (
		<div className="group relative w-max ">
			<h3 className=" ">{info}</h3>
			<div className=" rounded-lg z-50 group-hover:bg-black group-hover:opacity-75 pointer-events-none  -top-7 left-0 opacity-0 transition-opacity text-white px-1 absolute py-1">
				{children}
			</div>
		</div>
	);
};

export default Tooltip;
