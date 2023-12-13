import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import {
	clearAdminAllPost,
	deletePostAdmin,
	fetchAllUsersPost,
	increaseAdminAllPostPageNumber,
	setMyPostSelectedFilter,
} from "../redux/admin/adminSlice";
import Modal from "../components/Modal";
import DashboardCustomDropdown from "../components/DashboardCustomDropdown";
import { formatDate } from "../utils/dataFormatter";

import { ClearSearch, MessageUser, Tooltip } from "../components";

import { LoadingSpinner } from "../utils/Spinner";
import { BiUser } from "react-icons/bi";
import { setSearchTermInStore } from "../redux/user/userSlice";

const AllUsersPosts = () => {
	const {
		hasMore,
		allPost,
		MyPostSelectedFilter,
		adminAllPostStatus,
		adminAllPostTotalNumber,
	} = useSelector((store) => store.adminSlice);
	const { user, dashboardSearchTerm } = useSelector(
		(store) => store.userSlice
	);
	const id = user?._id;

	const dispatch = useDispatch();
	const observer = useRef();
	const [checkedItems, setCheckedItemId] = useState([]);

	const lastPostRef = useCallback(
		(node) => {
			if (adminAllPostStatus !== "loading") {
				if (observer.current) observer.current.disconnect();
				observer.current = new IntersectionObserver((entries) => {
					if (entries[0].isIntersecting && hasMore) {
						dispatch(increaseAdminAllPostPageNumber());
						dispatch(
							fetchAllUsersPost({
								userId: id,
								filter: MyPostSelectedFilter,
							})
						);
					}
				});
				if (node) observer.current.observe(node);
			}
		},
		[adminAllPostStatus, hasMore]
	);

	useEffect(() => {
		if (adminAllPostStatus === "loading") return;

		dispatch(clearAdminAllPost());
		dispatch(
			fetchAllUsersPost({
				userId: id,
				filter: MyPostSelectedFilter,
			})
		);
	}, [MyPostSelectedFilter, dashboardSearchTerm]);

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
		"Highest likes",
		"Lowest likes",
		"Latest",
		"Oldest",
		"Category",
		"Lowest view",
		"Highest view",
		"Lowest dislikes",
		"Highest dislikes",
	];

	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => {
		checkedItems.length > 0
			? setIsModalOpen(true)
			: toast.error("select post to delete");
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};
	const continueAction = () => {
		closeModal();
		if (checkedItems.length === 0) {
			toast.warning("Please Select Post To delete");
			return;
		}
		dispatch(deletePostAdmin(checkedItems));
	};
	const handleClearSearch = () => {
		dispatch(setSearchTermInStore(""));
	};

	return (
		<div className=" font-inter shadow-md  overflow-hidden ">
			{/* clear search */}
			<ClearSearch
				searchQuery={dashboardSearchTerm}
				handleClearSearch={handleClearSearch}
			/>
			{/* modal */}
			<div className="">
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
			</div>
			{/* table actions buttons */}
			<div className="flex gap-4 ml-10 flex-wrap ">
				<button
					onClick={openModal}
					className="  py-[0.15] rounded-lg hover:text-red-700 text-red-400 outline-none"
				>
					delete
				</button>
				<div className="">
					<DashboardCustomDropdown
						allFilters={allFilter}
						setSelectedFilter={setMyPostSelectedFilter}
						selectedFilter={MyPostSelectedFilter}
					/>
				</div>
				<h3 className="flex gap-2 items-center ">
					Total Post :<span>{adminAllPostTotalNumber}</span>
				</h3>
			</div>
			{/* table */}
			<div className=" max-h-[85vh] overflow-auto custom-scrollbar  min-w-[300px] ">
				<table className="">
					<thead className="tableHeading -top-10 bg-gray-800  text-white">
						<tr className="">
							<th className="bg-gray-800">
								<Tooltip info={"select All"}>
									<input
										type="checkbox"
										name="check"
										id="All"
										checked={checkedItems.length === allPost.length}
										onChange={() =>
											handleCheckedItemcsChange("All", allPost)
										}
										className="checkboxStyle"
									/>
								</Tooltip>
							</th>
							<th>Post Id</th>
							<th>created At</th>
							<th>number views</th>
							<th>category</th>
							<th>Likes</th>
							<th>DisLikes</th>
							<th className="bg-gray-800">Action</th>
						</tr>
					</thead>

					<tbody>
						{allPost.map((post, index) => (
							<tr
								key={index}
								ref={
									allPost.length === index + 1 && allPost.length > 1
										? lastPostRef
										: null
								}
								className=" transition duration-300 ease-in-out hover:bg-neutral-200  dark:hover:bg-neutral-800"
							>
								<td className=" bg-gray-50 tableData dark:bg-[#1C1C1C]">
									<input
										type="checkbox"
										name="check"
										className="checkboxStyle"
										id={post._id}
										checked={checkedItems.includes(post._id)}
										onChange={() => handleCheckedItemcsChange(post._id)}
									/>
								</td>

								<td className="tableData ">
									<Link to={`/single-post/${post._id}`}>
										<Tooltip info={post._id}>{post._id}</Tooltip>
									</Link>
								</td>
								<td className="tableData ">
									<Tooltip info={formatDate(post.createdAt)}>
										{formatDate(post.createdAt)}
									</Tooltip>
								</td>
								<td className="tableData ">
									<Tooltip info={post.numViews}>{post.numViews}</Tooltip>
								</td>
								<td className="tableData ">
									<Tooltip info={post.category}>{post.category}</Tooltip>
								</td>
								<td className="tableData ">
									<Tooltip info={post.likes.length}>
										{post.likes.length}
									</Tooltip>
								</td>
								<td className="tableData ">
									<Tooltip info={post.likes.length}>
										{post.disLikes.length}
									</Tooltip>
								</td>

								<td className="flex items-center px-3 gap-2   bg-gray-50 tableData dark:bg-[#1C1C1C] ">
									<Link
										to={`/profile/${post.user._id}`}
										className=" p-2 hover:bg-blue-200 transition-all duration-75 rounded-full"
									>
										<BiUser className=" text-blue-400 text-lg " />
									</Link>

									<MessageUser receiverId={post.user?._id} />
								</td>
							</tr>
						))}
					</tbody>
					{adminAllPostStatus === "loading" && (
						<tr>
							<td className="text-yellow-400  stickyBottom  bg-gray-50 tableData dark:bg-[#1C1C1C] "></td>
							<td className="text-yellow-400  stickyBottom  bg-gray-50 tableData dark:bg-[#1C1C1C] ">
								<LoadingSpinner />
							</td>
						</tr>
					)}
					{allPost.length === 0 && adminAllPostStatus === "success" && (
						<td className="text-yellow-400  stickyBottom  bg-gray-50 tableData dark:bg-[#1C1C1C] ">
							No User Found
						</td>
					)}
					{!hasMore &&
						adminAllPostStatus === "success" &&
						allPost.length > 0 && (
							<tr className="  bg-gray-50 tableData">
								<td></td>
								<td className="text-yellow-400  stickyBottom  bg-gray-50 tableData dark:bg-[#1C1C1C] ">
									No more User
								</td>
							</tr>
						)}
				</table>
			</div>
		</div>
	);
};

export default AllUsersPosts;
