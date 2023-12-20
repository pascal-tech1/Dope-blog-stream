import React from "react";
import { useDispatch } from "react-redux";
import { logOutUser, setChangeEmail } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { BsLock, BsMessenger } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { IoMdHelp } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";

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

	return (
		<>
			<div className="absolute top-8 right-4 drop-shadow-lg h-[50vh] rounded-lg z-[500] dark:bg-[#171717] border dark:border-gray-700   bg-white">
				<div className=" flex flex-col px-4 justify-start whitespace-nowrap  items-start font-inter gap-3 py-3 md:text-sm  ">
					<button
						onClick={() => {
							handleProfileClick();
							setIsMenuOpen(!isMenuOpen);
						}}
						className=" hover:bg-blue-100 dark:hover:bg-gray-800 flex gap-2 items-center py-1 px-2 rounded-lg transition-all delay-75"
					>
						<CiUser />
						profile
					</button>
					<button
						onClick={() => {
							handleUupdatePassword();
							setIsMenuOpen(!isMenuOpen);
						}}
						className=" hover:bg-blue-100 dark:hover:bg-gray-800 flex gap-2 items-center  py-1 px-2 rounded-lg transition-all delay-75"
					>
						<BsLock />
						update password
					</button>
					<button
						onClick={() => {
							handleChangeEmail();
							setIsMenuOpen(!isMenuOpen);
						}}
						className=" hover:bg-blue-100 dark:hover:bg-gray-800 flex gap-2 items-center  py-1 px-2 rounded-lg transition-all delay-75"
					>
						<BsMessenger />
						change email
					</button>
					<button
						onClick={() => {
							handleFaqClick();
							setIsMenuOpen(!isMenuOpen);
						}}
						className=" hover:bg-blue-100 dark:hover:bg-gray-800 flex gap-2 items-center  py-1 px-2 rounded-lg transition-all delay-75"
					>
						<IoMdHelp />
						FAQ
					</button>
					<button
						onClick={() => {
							handleLogOut();
							setIsMenuOpen(!isMenuOpen);
						}}
						className=" hover:bg-blue-100 dark:hover:bg-gray-800 flex gap-2 items-center text-red-400  py-1 px-2 rounded-lg transition-all delay-75"
					>
						<FiLogOut />
						logout
					</button>
				</div>
			</div>
		</>
	);
};

export default UserDashboardMenu;
