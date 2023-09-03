import React from "react";
import { HiUserGroup } from "react-icons/hi";

const UserDetailsCount = (props) => {
   
	return (
		<div className="bg-white shadow-sms flex py-2 space-x-8 px-2 items-center rounded-md ">
			<HiUserGroup
				className={`${props.textColor} font-bold text-2xl ${props.bgColor} rounded-md py-1 px-1 `}
			/>

			<div>
				<h1 className=" font-semibold text-sm">14,320</h1>
				<h3 className=" font-light text-[0.6rem]">followers</h3>
			</div>
		</div>
	);
};

export default UserDetailsCount;
