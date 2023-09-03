import React from "react";
import { UserDetailsCount } from "../../components";

const Dashboard = () => {
	return (
		<div className="font-inter flex flex-wrap gap-4 item-center ml-4">
			<UserDetailsCount
				bgColor={"bg-green-100"}
				textColor={"text-green-600"}
			/>
			<UserDetailsCount
				bgColor={"bg-blue-100"}
				textColor={"text-blue-600"}
			/>
			<UserDetailsCount
				bgColor={"bg-orange-100"}
				textColor={"text-orange-600"}
			/>
			<UserDetailsCount
				bgColor={"bg-red-100"}
				textColor={"text-red-600"}
			/>
		</div>
	);
};

export default Dashboard;
