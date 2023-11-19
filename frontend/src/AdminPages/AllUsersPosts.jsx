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
import Spinner from "../components/Spinner";
import { MessageUser, Tooltip } from "../components";

const AllUsersPosts = () => {
	const {
		hasMore,
		allPost,
		MyPostSelectedFilter,
		adminAllPostStatus,
		adminAllPostTotalNumber,
	} = useSelector((store) => store.adminSlice);
	const id = useSelector((store) => store.userSlice?.user?._id);

	const dispatch = useDispatch();
	const observer = useRef();
	const [checkedPostId, setCheckedPostid] = useState([]);

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
	}, [MyPostSelectedFilter]);

	const posts = [
		{
			all: "box",
			_id: "Post Id",
			createdAt: "Created At",
			category: "Category",
			numViews: "views",
			likes: "likes",
			disLikes: "disLikes",
			action: "action",
		},

		...allPost,
	];
	const handleCheckedPostChange = (_id) => {
		if (_id === "Post Id") {
			if (checkedPostId.length === posts.length) {
				setCheckedPostid([]);
			} else {
				const allPostIds = posts
					.filter((post) => post._id !== "All") // Exclude "All"
					.map((post) => post._id);
				setCheckedPostid(allPostIds);
			}
		} else {
			if (checkedPostId.includes(_id)) {
				setCheckedPostid((prev) =>
					prev.filter((prevId) => prevId !== _id)
				);
			} else {
				setCheckedPostid((prev) => [...prev, _id]);
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
		checkedPostId.length > 0
			? setIsModalOpen(true)
			: toast.error("select post to delete");
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
		dispatch(deletePostAdmin(checkedPostId));
	};

	return (
		<div className="tableContainer min-w-[900px]   ">
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				onContinue={continueAction}
			>
				<div>
					<h1>
						Do you want to continue to delete {checkedPostId.length} post
					</h1>
					<h3>Remember this Action cannot be undone</h3>
				</div>
			</Modal>
			{/* table action buttons */}
			<div className="tableActionStyle">
				<button
					onClick={openModal}
					className="  py-[0.15] rounded-lg hover:text-red-700 text-red-400 outline-none"
				>
					delete
				</button>
				<div>
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
			{/* table begin */}
			<div className="tableBaginsStyle ">
				{posts.map((post, index) => {
					return (
						<div
							ref={
								posts.length === index + 1 && posts.length > 1
									? lastPostRef
									: null
							}
							className={`${
								post.action === "action" ? " bg-gray-500  text-white" : ""
							}  grid grid-cols-10 text-start items-center gap-2  border-b py-3 px-2`}
						>
							<div className="col-start-1 col-span-2 px-2 flex gap-2">
								<input
									type="checkbox"
									name="check"
									id={posts._id}
									checked={checkedPostId.includes(post._id)}
									onChange={() => handleCheckedPostChange(post._id)}
									className="checkboxStyle"
								/>

								<Link to={`/single-post/${post._id}`}>
									<Tooltip info={`${post._id.toString().slice(0, 12)}...`}>
										<h3>{post._id}</h3>
									</Tooltip>
								</Link>
							</div>
							<h3 className="  col-start-3 col-span-2  ">
								{post.createdAt === "Created At"
									? "Created"
									: formatDate(post.createdAt)}
							</h3>

							<div className="col-start-5 col-span-1">
								{post.category.length > 10 ? (
									<Tooltip
										info={`${post.category.toString().slice(0, 10)}...`}
									>
										<h3>{post.category}</h3>
									</Tooltip>
								) : (
									<h3>{post.category}</h3>
								)}
							</div>
							<h3 className="col-start-6 col-span-1 ">{post.numViews}</h3>
							<h3 className="col-start-7 col-span-1">
								{post.likes === "likes" ? "Like" : post.likes.length}
							</h3>
							<h3 className="col-start-8 col-span-1">
								{post.disLikes === "disLikes"
									? "disLikes"
									: post.disLikes.length}
							</h3>

							<h3 className="col-span-2 col-start-9">
								{post.action === "action" ? (
									"Action"
								) : (
									<div className="flex items-center gap-2">
										<Link
											to={`/profile/${post.user._id}`}
											className=" whitespace-nowrap bg-blue-400 text-white rounded-lg px-1 py-[0.6px] hover:bg-blue-300 drop-shadow-md transition-all delay-75 hover:drop-shadow-none"
										>
											view user
										</Link>
										<MessageUser receiverId={post.user?._id} />
									</div>
								)}
							</h3>
						</div>
					);
				})}
				<div className="my-2 place-self-center">
					{adminAllPostStatus === "loading" && <Spinner />}
				</div>
				<div className=" place-self-center">
					{!hasMore && adminAllPostStatus === "success" && (
						<div className=" text-yellow-600 my-4">No more Post Buddy</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AllUsersPosts;
