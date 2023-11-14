import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import {
	clearAdminAllUser,
	deletePostAdmin,
	fetchAllUsers,
	increaseAdminAllUsersPageNumber,
	setAllUsersSelectedFilter,
} from "../redux/admin/adminSlice";
import Modal from "../components/Modal";
import DashboardCustomDropdown from "../components/DashboardCustomDropdown";
import { formatDate } from "../utils/dataFormatter";
import Spinner from "../components/Spinner";
import { MessageUser, Tooltip } from "../components";

const AllUsers = () => {
	const {
		allUsers,
		AdminAllUserSelectedFilter,
		adminAllUsersStatus,
		adminAllUsersTotalNumber,
		AdminFetchUsersHasMore,
		adminFetchUsersHasMore,
	} = useSelector((store) => store.adminSlice);

	const dispatch = useDispatch();
	const observer = useRef();
	const [checkedItems, setCheckedItemId] = useState([]);

	const lastPostRef = useCallback(
		(node) => {
			if (adminAllUsersStatus !== "loading") {
				if (observer.current) observer.current.disconnect();
				observer.current = new IntersectionObserver((entries) => {
					console.log(adminFetchUsersHasMore);
					if (entries[0].isIntersecting && adminFetchUsersHasMore) {
						console.log("im here intersecting");
						dispatch(increaseAdminAllUsersPageNumber());
						dispatch(
							fetchAllUsers({
								filter: AdminAllUserSelectedFilter,
							})
						);
					}
				});
				if (node) observer.current.observe(node);
			}
		},
		[adminAllUsersStatus, adminFetchUsersHasMore]
	);
	console.log(lastPostRef);
	useEffect(() => {
		if (adminAllUsersStatus === "loading") return;

		dispatch(clearAdminAllUser());
		dispatch(
			fetchAllUsers({
				filter: AdminAllUserSelectedFilter,
			})
		);
	}, [AdminAllUserSelectedFilter]);

	const tableItems = [
		{
			all: "box",
			_id: "User Id",
			firstName: "First Name",
			lastName: "Last Name",
			email: "email",
			createdAt: "Join Date",
			postsCount: "Post Count",
			followersCount: "Followers Count",
			followingCount: "Following Count",
			action: "action",
		},

		...allUsers,
	];
	const handleCheckedItemcsChange = (_id) => {
		if (_id === "User Id") {
			if (checkedItems.length === tableItems.length) {
				setCheckedItemId([]);
			} else {
				const allItemId = tableItems.map((item) => item._id);
				setCheckedItemId(allItemId);
			}
		} else {
			checkedItems.includes("User Id") &&
				setCheckedItemId((prev) =>
					prev.filter((item) => item !== "User Id")
				);
			if (checkedItems.includes(_id)) {
				setCheckedItemId((prev) =>
					prev.filter((prevId) => prevId !== _id)
				);
			} else {
				setCheckedItemId((prev) => [...prev, _id]);
			}
		}
	};

	const allFilter = [
		"Newest User",
		"Oldest User",
		"highest Followers",
		"lowest followers",
		"highest No Post",
		"lowest No Post",
		"highest Following",
		"lowest Following",
	];

	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => {
		setCheckedItemId((prev) => prev.filter((item) => item !== "User Id"));

		checkedItems.length > 0
			? setIsModalOpen(true)
			: toast.error("select post to delete");
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};
	const continueAction = () => {
		setCheckedItemId((prev) => prev.filter((item) => item !== "User Id"));
		closeModal();
		if (checkedItems.length === 0) {
			toast.warning("Please Select Post To delete");
			return;
		}

		dispatch(deletePostAdmin(checkedItems));
	};

	return (
		<div className="mt-16 shadow-md rounded-lg  font-medium  mx-2  md:mx-6 grid overflow-x-scroll min-w-[1000px]  ">
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				onContinue={continueAction}
			>
				<div>
					<h1>
						Do you want to continue to delete {checkedItems.length} post
					</h1>
					<h3>Remember this Action cannot be undone</h3>
				</div>
			</Modal>
			<div className="flex justify-between  mx-6 gap-4 mb-4 ">
				<button
					onClick={openModal}
					className="  py-[0.15] rounded-lg hover:text-red-700 text-red-400 outline-none"
				>
					delete
				</button>
				<div className="">
					<DashboardCustomDropdown
						allFilters={allFilter}
						setSelectedFilter={setAllUsersSelectedFilter}
						selectedFilter={AdminAllUserSelectedFilter}
					/>
				</div>
				<h3 className="flex gap-2 items-center ">
					Total Post :<span>{adminAllUsersTotalNumber}</span>
				</h3>
			</div>
			<div className=" ">
				{tableItems.map((user, index) => {
					console.log(tableItems.length);
					return (
						<div
							ref={
								tableItems.length === index + 1 && tableItems.length > 1
									? lastPostRef
									: null
							}
							className={`${
								user.action === "action" ? " bg-gray-500  text-white" : ""
							}  grid grid-cols-11  text-center border-b py-4 px-2`}
						>
							<div className="col-start-1 col-span-2 px-2 flex gap-2">
								<input
									type="checkbox"
									name="check"
									id={user._id}
									checked={checkedItems.includes(user._id)}
									onChange={() => handleCheckedItemcsChange(user._id)}
									className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
								/>

								<Link to={`/profile/${user._id}`}>
									<Tooltip info={`${user._id.toString().slice(0, 12)}...`}>
										<h3>{user._id}</h3>
									</Tooltip>
								</Link>
							</div>
							{user.firstName.length > 12 ? (
								<Tooltip info={`${user.firstName.slice(0, 23)}...`}>
									<h3>{user.firstName}</h3>
								</Tooltip>
							) : (
								<h3>{user.firstName}</h3>
							)}

							{user.lastName.length > 12 ? (
								<Tooltip info={`${user.lastName.slice(0, 23)}...`}>
									<h3>{user.lastName}</h3>
								</Tooltip>
							) : (
								<h3>{user.lastName}</h3>
							)}
							<div className="">
								{user.email.length > 20 ? (
									<Tooltip info={`${user.email.slice(0, 20)}...`}>
										<h3>{user.email}</h3>
									</Tooltip>
								) : (
									<h3>{user.email}</h3>
								)}
							</div>
							<h3 className="  col-start-7 col-span-1">
								{user.createdAt === "Join Date"
									? "Join Date"
									: formatDate(user.createdAt)}
							</h3>

							<h3 className="col-start-8 col-span-1">{user.postsCount}</h3>
							<h3 className="col-start-9 col-span-1">
								{user.followersCount}
							</h3>
							<h3 className="col-start-10 col-span-1">
								{user.followingCount}
							</h3>
							<div className="col-span-1 col-start-11 place-self-center">
								{user.action === "action" ? (
									"Action"
								) : (
									<MessageUser receiverId={user?._id} />
								)}
							</div>
						</div>
					);
				})}
			</div>
			<div className="my-2 place-self-center">
				{adminAllUsersStatus === "loading" && <Spinner />}
			</div>
			<div className=" place-self-center">
				{!adminFetchUsersHasMore && adminAllUsersStatus === "success" && (
					<div className=" text-yellow-600 my-4">No more Post Buddy</div>
				)}
			</div>
		</div>
	);
};

export default AllUsers;
