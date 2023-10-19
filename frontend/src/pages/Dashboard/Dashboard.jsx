import React, { useEffect } from "react";
import {
	PostDashboard,
	Spinner,
	UserDetailsCount,
} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { articles, messages } from "../../utils/data";
import {
	fetchUserPostHistory,
	fetchUserSavedPost,
} from "../../redux/post/morePostSlice";
import { Link } from "react-router-dom";

const Dashboard = () => {
	const dispatch = useDispatch();
	// const user = useSelector((store) => store?.userSlice);
	const {
		userPostHistory,
		userPostHistoryStatus,
		userSavedPost,
		userSavedPostStatus,
	} = useSelector((store) => store?.morePostSlice);
	console.log(userPostHistory);

	useEffect(() => {
		dispatch(fetchUserPostHistory());
		dispatch(fetchUserSavedPost());
	}, []);
	return (
		<div className=" flex flex-col sfont-inter lg:grid grid-cols-6 lg:gap-8 mt-16 mx-4">
			<div className=" col-start-1 col-span-4 grid grid-cols-4 gap-6  row-start-1">
				<div className=" col-start-1 col-span-2">
					<UserDetailsCount
						bgColor={"bg-green-100"}
						textColor={"text-green-600"}
					/>
				</div>
				<div className="  col-start-3 col-span-2">
					<UserDetailsCount
						bgColor={"bg-blue-100"}
						textColor={"text-blue-600"}
					/>
				</div>
				<div className="  col-start-1 col-span-2">
					<UserDetailsCount
						bgColor={"bg-orange-100"}
						textColor={"text-orange-600"}
					/>
				</div>
				<div className=" col-start-3 col-span-2">
					<UserDetailsCount
						bgColor={"bg-red-100"}
						textColor={"text-red-600"}
					/>
				</div>
				<div className=" col-start-1 col-span-4 bg-blue-200 h-60 ">
					chart
				</div>
			</div>

			<div className=" col-start-5 col-span-full row-start-1 rounded-lg bg-white px-3 py-3 ">
				<h1 className=" font-bold text-gray-800 mb-3">Recent Mesaages</h1>
				<div className="flex gap-6 flex-col">
					{messages.map((message) => {
						return (
							<div className="flex gap-2">
								<img
									src="../../../public/user.png"
									alt=""
									className=" self-start border bg-blue-400 w-10 h10 rounded-lg"
								/>
								<div className=" text-xs font-medium flex gap-1 flex-col">
									<h3 className="  text-pink-400">
										{message.name}{" "}
										<span className=" text-gray-400"> has commented</span>
									</h3>
									<h3>{message.message}</h3>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className=" col-start-1 col-span-full  border-t py-4 flex gap-8 flex-col ">
				<PostDashboard
					posts={userPostHistory}
					status={userPostHistoryStatus}
					title={"Post View History"}
					page={"/dashboard/post-History"}
				/>
			</div>
			<div className=" col-start-1 col-span-full mb-6 border-y py-4 flex gap-8 flex-col ">
				<PostDashboard
					posts={userSavedPost}
					status={userSavedPostStatus}
					title={"Saved Post"}
					page={"/dashboard/post-Saved"}
				/>
			</div>
		</div>
	);
};

export default Dashboard;
