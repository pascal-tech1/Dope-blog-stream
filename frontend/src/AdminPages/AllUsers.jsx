import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import {
	clearAdminAllUser,
	deletePostAdmin,
	deleteUserAdmin,
	fetchAllUsers,
	increaseAdminAllUsersPageNumber,
	setAllUsersSelectedFilter,
} from "../redux/admin/adminSlice";
import Modal from "../components/Modal";
import DashboardCustomDropdown from "../components/DashboardCustomDropdown";
import { formatDate } from "../utils/dataFormatter";
import Spinner from "../components/Spinner";
import { BlockOrUnblockUser, MessageUser, Tooltip } from "../components";

const AllUsers = () => {
	const {
		allUsers,
		AdminAllUserSelectedFilter,
		adminAllUsersStatus,
		adminAllUsersTotalNumber,
		AdminFetchUsersHasMore,
		adminFetchUsersHasMore,
	} = useSelector((store) => store.adminSlice);

	const { dashboardSearchTerm } = useSelector((store) => store.userSlice);

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

	useEffect(() => {
		if (adminAllUsersStatus === "loading") return;

		dispatch(clearAdminAllUser());
		dispatch(
			fetchAllUsers({
				filter: AdminAllUserSelectedFilter,
			})
		);
	}, [AdminAllUserSelectedFilter, dashboardSearchTerm]);

	const tableItems = [
		{
			all: "box",
			_id: "User Id",
			firstName: "First Name",
			lastName: "Last Name",
			email: "email",
			createdAt: "Join Date",
			postsCount: "Post Count",
			followersCount: "Followers",
			followingCount: "Following",
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
			: toast.error("please select users to delete");
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};
	const continueAction = () => {
		setCheckedItemId((prev) => prev.filter((item) => item !== "User Id"));
		closeModal();
		if (checkedItems.length === 0) {
			toast.warning("Please Select Users To delete");
			return;
		}

		dispatch(deleteUserAdmin(checkedItems));
	};

	return (
		<div className=" tableContainer overflow-x-scroll min-w-[1200px] relative ">
			{/* modal */}
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				onContinue={continueAction}
			>
				<div>
					<h1>
						Do you want to continue to delete {checkedItems.length} user
					</h1>
					<h3>Remember this Action cannot be undone</h3>
				</div>
			</Modal>
			{/* table actions buttons */}
			<div className="tableActionStyle ">
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
					Total Users :<span>{adminAllUsersTotalNumber}</span>
				</h3>
			</div>
			{/* table */}
			<div className="tableBaginsStyle relative">
				{tableItems.map((user, index) => {
					return (
						<div
							ref={
								tableItems.length === index + 1 && tableItems.length > 1
									? lastPostRef
									: null
							}
							className={`${
								user.action === "action"
									? "tableHeading  -top-0 items-center z-30  bg-gray-500  text-white "
									: ""
							} grid grid-cols-12 gap-2 text-start border py-3 items-cente `}
						>
							<div className=" px-2 flex gap-2 items-center  ">
								<input
									type="checkbox"
									name="check"
									id={user._id}
									checked={checkedItems.includes(user._id)}
									onChange={() => handleCheckedItemcsChange(user._id)}
									className="checkboxStyle"
								/>

								<Link to={`/profile/${user._id}`} className=" col-span-3">
									<Tooltip info={user._id}>
										<h3>{user._id}</h3>
									</Tooltip>
								</Link>
							</div>

							<div className=" col-start-4">
								<Tooltip info={user.firstName}>
									<h3>{user.firstName}</h3>
								</Tooltip>
							</div>

							<Tooltip info={user.lastName}>
								<h3>{user.lastName}</h3>
							</Tooltip>
							<div className=" col-start-6 col-span-2 px-4">
								<Tooltip info={user.email}>
									<h3>{user.email}</h3>
								</Tooltip>
							</div>
							<Tooltip info={formatDate(user.createdAt)}>
								<h3>
									{user.createdAt === "Join Date"
										? "Join Date"
										: formatDate(user.createdAt)}
								</h3>
							</Tooltip>

							<h3 className="">{user.postsCount}</h3>
							<h3 className="">{user.followersCount}</h3>
							<h3 className="">{user.followingCount}</h3>
							<div className=" relative self-start  ">
								{user.action === "action" ? (
									"Action"
								) : (
									<div className="flex gap-1 items-center right-4 sticky right-0 ">
										<MessageUser receiverId={user?._id} />
										<BlockOrUnblockUser user={user} />
									</div>
								)}
							</div>
						</div>
					);
				})}
				<div className="my-2 place-self-center">
					{adminAllUsersStatus === "loading" && <Spinner />}
				</div>
				<div className=" place-self-center">
					{!adminFetchUsersHasMore &&
						adminAllUsersStatus === "success" && (
							<div className=" text-yellow-600 my-4">
								No more user
							</div>
						)}
				</div>
				<div className=" place-self-center">
					{allUsers.length===0 &&
						adminAllUsersStatus === "success" && (
							<div className=" text-yellow-600 my-4">
								No User found
							</div>
						)}
				</div>
			</div>
		</div>
	);
};

export default AllUsers;
