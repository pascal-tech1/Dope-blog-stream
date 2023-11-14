import React from "react";

const Tooltip = ({  info, children }) => {
	return (
		<div className="group relative w-max z-10">
			{info}
			<div className=" group-hover:bg-black group-hover:opacity-75 pointer-events-none absolute -top-7 left-0 w-max opacity-0 transition-opacity text-white px-1 py-1">
				{children}
			</div>
		</div>
	);
};

export default Tooltip;
