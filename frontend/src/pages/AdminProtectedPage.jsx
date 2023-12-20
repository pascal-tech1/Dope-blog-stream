import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Error from "./Error";

const AdminProtectedPage = () => {
	const { user, token } = useSelector((store) => store.userSlice);
	if (!token) {
		return <Navigate to="/login" />;
	}

	if (user && !user?.isAdmin) {
		console.log(user);
		return <Error />;
	}
	return (
		<div>
			<Outlet />
		</div>
	);
};

export default AdminProtectedPage;
