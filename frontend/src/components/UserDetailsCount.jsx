import React from "react";

const UserDetailsCount = ({ count, text, children }) => {
	return (
		<div className=" bg-white drop-shadow-sm self-center justify-center flex py-2 space-x-4  px-2 items-center rounded-md ">
			{children}
			<div>
				<h1 className=" font-bold">{count}</h1>
				<h3 className=" font-light text-[0.7rem]">{text}</h3>
			</div>
		</div>
	);
};

export default UserDetailsCount;
