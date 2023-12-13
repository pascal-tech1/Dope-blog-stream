import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Error } from ".";

const AdminProtectedPage = () => {
	const { user } = useSelector((store) => store.userSlice);
	console.log(user);
	if (!user?.isAdmin) {
		return <Error />;
	}
	return (
		<div>
			<Outlet />
		</div>
	);
};

export default AdminProtectedPage;
