import React from "react";

const UserDetailsCount = ({ count, text, children }) => {
	return (
		<div className=" bg-white dark:bg-[#171717]  drop-shadow-sm   flex py-2 space-x-4  px-2 rounded-md ">
			{children}
			<div>
				<h1 className=" font-bold">{count}</h1>
				<h3 className=" font-light">{text}</h3>
			</div>
		</div>
	);
};

export default UserDetailsCount;
