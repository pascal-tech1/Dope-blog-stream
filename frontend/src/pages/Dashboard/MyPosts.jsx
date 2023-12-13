import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
	clearCreatorAllPost,
	deletePost,
	fetchCreatorPosts,
	setMyPostSelectedFilter,
} from "../../redux/post/generalPostSlice";
import { formatDate } from "../../utils/dataFormatter";
import {
	ClearSearch,
	EditPostBtn,
	Modal,
	Spinner,
	Tooltip,
} from "../../components";
import DashboardCustomDropdown from "../../components/DashboardCustomDropdown";
import { toast } from "react-toastify";
import {
	setIsSearchBArNeeded,
	setSearchTermInStore,
} from "../../redux/user/userSlice";
import { LoadingSpinner } from "../../utils/Spinner";

const MyPosts = () => {
	useEffect(() => {
		dispatch(setIsSearchBArNeeded(true));
		dispatch(setSearchTermInStore(""));
	}, []);
	const {
		creatorPostStatus,
		creatorAllPost,
		creatoPostTotalNumber,
		hasMore,
		MyPostSelectedFilter,
	} = useSelector((store) => store.generalPostSlice);

	const { user, dashboardSearchTerm } = useSelector(
		(store) => store.userSlice
	);
	const id = user?._id;
	const dispatch = useDispatch();
	const observer = useRef();
	const [checkedItems, setCheckedItemId] = useState([]);
	let page = 1;
	const lastPostRef = useCallback(
		(node) => {
			if (creatorPostStatus === "loading") return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					if (!id) return;
					page += 1;
					dispatch(
						fetchCreatorPosts({
							userId: id,
							filter: MyPostSelectedFilter,
							page,
						})
					);
				}
			});
			if (node) observer.current.observe(node);
		},
		[creatorPostStatus, hasMore]
	);

	useEffect(() => {
		if (id) {
			page = 1;
			dispatch(clearCreatorAllPost());
			dispatch(
				fetchCreatorPosts({
					userId: id,
					filter: MyPostSelectedFilter,
					page,
				})
			);
		} else return;
	}, [MyPostSelectedFilter, id, dashboardSearchTerm]);

	const posts = [
		{
			_id: "All",
			all: "box",
			title: "Post title",
			createdAt: "Created",
			category: "Category",
			numViews: "views",
			likes: "likes",
			disLikes: "disLikes",
			action: "action",
		},

		...creatorAllPost,
	];
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
		"A-Z",
		"Z-A",
		"Category",
		"Lowest view",
		"Highest view",
		"Lowest dislikes",
		"Highest dislikes",
	];

	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => {
		setIsModalOpen(true);
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};
	const continueAction = () => {
		closeModal();
		if (checkedPostId.length === 0) {
			toast.warning("Please Select Post To delete");
			return;
		}
		dispatch(deletePost(checkedPostId));
	};
	const handleClearSearch = () => {
		dispatch(setSearchTermInStore(""));
		
	};

	return (
		<div className="  font-inter overflow-hidden shadow-md  ">
			{/* clear search */}
			<ClearSearch
				searchQuery={dashboardSearchTerm}
				handleClearSearch={handleClearSearch}
			/>
			{/* modal */}
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
			{/* table actions buttons */}
			<div className="flex gap-4 ml-10 flex-wrap  ">
				<button
					onClick={openModal}
					className="  py-[0.15] rounded-lg  hover:bg-red-400 hover:text-slate-200 px-1 transition-all duration-75 text-red-400 outline-none"
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
					Total Post :<span>{creatoPostTotalNumber}</span>
				</h3>
			</div>
			{/* table */}

			<div className=" max-h-[85vh] overflow-auto custom-scrollbar  min-w-[300px]   ">
				<table className="">
					<thead className="tableHeading -top-10 bg-gray-500 dark:bg-gray-900  border  text-white ">
						<tr>
							<th className="bg-gray-500 dark:bg-gray-900 z-10">
								<Tooltip info={"select All"}>
									<input
										type="checkbox"
										name="check"
										id="All"
										checked={checkedItems.length === creatorAllPost.length}
										onChange={() =>
											handleCheckedItemcsChange("All", creatorAllPost)
										}
										className="checkboxStyle "
									/>
								</Tooltip>
							</th>
							<th className="">Post Id</th>
							<th>created At</th>
							<th>number views</th>
							<th>Catgegory</th>
							<th>likes</th>
							<th>DisLikes</th>
							<th className="bg-gray-500 dark:bg-gray-900 z-10">
								Actions
							</th>
						</tr>
					</thead>

					<tbody className="">
						{creatorAllPost.map((post, index) => (
							<tr
								ref={
									creatorAllPost.length === index + 1 &&
									creatorAllPost.length > 1
										? lastPostRef
										: null
								}
								className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:hover:bg-gray-600 dark:border-neutral-100 "
							>
								<td className=" bg-gray-50  dark:bg-[#1C1C1C] tableData ">
									<input
										type="checkbox"
										name="check"
										className="checkboxStyle   "
										id={post._id}
										checked={checkedItems.includes(post._id)}
										onChange={() => handleCheckedItemcsChange(post._id)}
									/>
								</td>

								<td className="tableData">
									<Link to={`/single-post/${post?._id}`}>
										<Tooltip info={post.title}>{post.title}</Tooltip>
									</Link>
								</td>

								<td className="tableData">
									<Tooltip info={formatDate(post.createdAt)}>
										{formatDate(post.createdAt)}
									</Tooltip>
								</td>
								<td className="tableData">
									<Tooltip info={post.numViews}>{post.numViews}</Tooltip>
								</td>
								<td className="tableData">
									<Tooltip info={post.category}>{post.category}</Tooltip>
								</td>

								<td className="tableData">
									<Tooltip info={post.likes.length}>
										{post.likes.length}
									</Tooltip>
								</td>
								<td className="tableData">{post.disLikes.length}</td>
								<td className=" bg-gray-50 tableData  dark:bg-[#1C1C1C] ">
									<EditPostBtn postId={post._id} />
								</td>
							</tr>
						))}
					</tbody>
					{/* conditionary rendering post status */}
					{creatorPostStatus === "loading" && (
						<tr>
							<td className="bg-gray-50  tableData dark:bg-[#1C1C1C]"></td>
							<td className=" bg-gray-50 tableData dark:bg-[#1C1C1C]">
								<LoadingSpinner />
							</td>
						</tr>
					)}

					{!hasMore &&
						creatorPostStatus === "success" &&
						creatorAllPost.length > 0 && (
							<tr className=" bg-gray-50  dark:bg-[#1C1C1C]">
								<td className="bg-gray-50 tableData dark:bg-[#1C1C1C]"></td>
								<td className=" text-yellow-400 tableData  stickyBottom bg-white dark:bg-[#1C1C1C] ">
									No more User
								</td>
							</tr>
						)}

					{creatorAllPost.length === 0 &&
						creatorPostStatus === "success" && (
							<td className=" text-yellow-400 tableData stickyBottom bg-gray-50  dark:bg-[#1C1C1C] ">
								No User Found
							</td>
						)}
				</table>
			</div>
		</div>
	);
};

export default MyPosts;
