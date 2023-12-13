import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import {
	clearAdminAllUser,
	deleteUserAdmin,
	fetchAllUsers,
	increaseAdminAllUsersPageNumber,
	setAllUsersSelectedFilter,
} from "../redux/admin/adminSlice";
import Modal from "../components/Modal";
import DashboardCustomDropdown from "../components/DashboardCustomDropdown";
import { formatDate } from "../utils/dataFormatter";
import Spinner from "../components/Spinner";
import {
	BlockOrUnblockUser,
	ClearSearch,
	MessageUser,
	Tooltip,
} from "../components";
import {
	setIsSearchBArNeeded,
	setSearchTermInStore,
} from "../redux/user/userSlice";
import { MdAdminPanelSettings } from "react-icons/md";
import MakeAdmin from "./MakeAdmin";

const AllUsers = () => {
	useEffect(() => {
		dispatch(setIsSearchBArNeeded(true));
		dispatch(setSearchTermInStore(""));
	}, []);
	const {
		allUsers,
		AdminAllUserSelectedFilter,
		adminAllUsersStatus,
		adminAllUsersTotalNumber,
		AdminFetchUsersHasMore,
		adminFetchUsersHasMore,
		MyPostSelectedFilter,
	} = useSelector((store) => store.adminSlice);
	const { dashboardSearchTerm, user } = useSelector(
		(store) => store.userSlice
	);

	const dispatch = useDispatch();
	const observer = useRef();
	const [checkedItems, setCheckedItemId] = useState([]);

	const lastPostRef = useCallback(
		(node) => {
			if (adminAllUsersStatus !== "loading") {
				if (observer.current) observer.current.disconnect();
				observer.current = new IntersectionObserver((entries) => {
					if (entries[0].isIntersecting && adminFetchUsersHasMore) {
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

	const handleCheckedItemcsChange = (_id, tableItems) => {
		if (_id === "All") {
			if (checkedItems.length === tableItems.length) {
				setCheckedItemId([]);
			} else {
				const allItemId = tableItems.map((item) => item._id);
				setCheckedItemId(allItemId);
			}
		} else {
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
		"check",
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
	const handleClearSearch = () => {
		dispatch(setSearchTermInStore(""));
	};

	return (
		<div className="font-inter overflow-hidden shadow-md relative">
			{/* clear search */}
			<ClearSearch
				searchQuery={dashboardSearchTerm}
				handleClearSearch={handleClearSearch}
			/>
			{/* modal */}
			<div className=" z-[1000]">
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
			</div>
			{/* table actions buttons */}
			<div className="flex gap-4 ml-10 flex-wrap">
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
			<div className=" max-h-[85vh] overflow-auto  min-w-[300px] custom-scrollbar mx-3">
				<table className="">
					<thead className="tableHeading -top-10 bg-gray-800  text-white z-50 ">
						<tr>
							<th className=" bg-gray-800">
								<Tooltip info={"select All"}>
									<input
										type="checkbox"
										name="check"
										id="All"
										checked={checkedItems.length === allUsers.length}
										onChange={() =>
											handleCheckedItemcsChange("All", allUsers)
										}
										className="checkboxStyle"
									/>
								</Tooltip>
							</th>
							<th>User Id</th>
							<th>Verified</th>
							<th>Frst Name</th>
							<th>Last Name</th>
							<th>Email</th>
							<th>Join Date</th>
							<th>No Posts</th>
							<th>No followers</th>
							<th>No following</th>
							<th className="bg-gray-800">Action</th>
						</tr>
					</thead>

					<tbody className="">
						{allUsers.map((singleUser, index) => (
							<tr
								key={index}
								ref={
									allUsers.length === index + 1 && allUsers.length > 1
										? lastPostRef
										: null
								}
								className="transition duration-300 ease-in-out hover:bg-neutral-200  dark:hover:bg-neutral-800"
							>
								<td className="bg-gray-50 tableData  dark:bg-[#1C1C1C]">
									<input
										type="checkbox"
										name="check"
										className="checkboxStyle"
										id={singleUser._id}
										checked={checkedItems.includes(singleUser._id)}
										onChange={() =>
											handleCheckedItemcsChange(singleUser._id)
										}
									/>
								</td>

								<td className="tableData ">
									<Link to={`/profile/${singleUser._id}`}>
										<Tooltip info={singleUser._id}>
											{singleUser._id}
										</Tooltip>
									</Link>
								</td>
								<td className="tableData ">
									<Tooltip
										info={singleUser.isAccountVerified ? "Yes" : "NO"}
									>
										{singleUser.isAccountVerified ? "Yes" : "NO"}
									</Tooltip>
								</td>
								<td className="tableData ">
									<Tooltip info={singleUser.firstName}>
										{singleUser.firstName}
									</Tooltip>
								</td>
								<td className="tableData ">
									<Tooltip info={singleUser.lastName}>
										{singleUser.lastName}
									</Tooltip>
								</td>
								<td className="tableData ">
									<Tooltip info={singleUser.email}>
										{singleUser.email}
									</Tooltip>
								</td>
								<td className="tableData ">
									<Tooltip info={formatDate(singleUser.createdAt)}>
										{formatDate(singleUser.createdAt)}
									</Tooltip>
								</td>
								<td className="tableData ">{singleUser.postsCount}</td>
								<td className="tableData ">{singleUser.followersCount}</td>
								<td className="tableData ">{singleUser.followingCount}</td>

								<td className="flex   bg-gray-50 tableData  dark:bg-[#1C1C1C] items-center ">
									<MessageUser receiverId={singleUser._id} />

									<BlockOrUnblockUser user={singleUser} />
									{user?.isOwner && <MakeAdmin user={singleUser} />}
								</td>
							</tr>
						))}
					</tbody>
					<td className="stickyBottom tableData ">
						{adminAllUsersStatus === "loading" && <Spinner />}
					</td>

					{!adminFetchUsersHasMore &&
						adminAllUsersStatus === "success" && (
							<td className=" text-yellow-400  stickyBottom bg-gray-50 tableData dark:bg-[#1C1C1C] ">
								No more User
							</td>
						)}

					{allUsers.length === 0 && adminAllUsersStatus === "success" && (
						<td className="  text-yellow-400  stickyBottom bg-gray-50 tableData  dark:bg-[#1C1C1C] ">
							No User found
						</td>
					)}
				</table>
			</div>
		</div>
	);
};

export default AllUsers;
