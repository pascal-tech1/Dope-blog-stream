import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logOutUser, setChangeEmail } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const UserDashboardMenu = ({ isMenuOpen, setIsMenuOpen }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleProfileClick = () => {
		navigate("/profile-view");
	};

	const handleUupdatePassword = () => {
		navigate("/update-password");
	};

	const handleChangeEmail = () => {
		dispatch(setChangeEmail());
	};

	const handleFaqClick = () => {};

	const handleLogOut = () => {
		dispatch(logOutUser());
		navigate("/");
	};

	const menuItem = [
		{ title: "profile", action: handleProfileClick },
		{ title: "update password", action: handleUupdatePassword },
		{ title: "change email", action: handleChangeEmail },
		{ title: "FAQ", action: handleFaqClick },
		{ title: "log Out", action: handleLogOut },
	];

	return (
		<>
			<div className="absolute top-8 right-4 drop-shadow-lg h-[50vh] rounded-lg z-[500]   bg-white">
				<div className=" flex flex-col px-4 justify-start whitespace-nowrap  items-start font-inter gap-3 py-3 text-sm  ">
					{menuItem.map((item) => (
						<button
							onClick={() => {
								item.action();
								setIsMenuOpen(!isMenuOpen);
							}}
							className={`${
								item.title === "log Out" && " text-red-400"
							} hover:bg-blue-100  py-1 px-2 rounded-lg transition-all delay-75`}
						>
							{item.title}
						</button>
					))}
				</div>
			</div>
		</>
	);
};

export default UserDashboardMenu;
