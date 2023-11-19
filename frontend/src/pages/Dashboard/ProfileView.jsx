import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FilerobotImageEditor from "filerobot-image-editor";
import {
	AdditionalUserProfile,
	FollowUsersList,
	Spinner,
	UserBio,
	UserProfile,
} from "../../components";
import {
	fetchUserFollowingList,
	fetchUserFollowersList,
	updateFollowingListPageNumber,
	setFirstFetchFollowersUser,
	setFirstFetchFollowingUser,
	updateUser,
	uploadProfilePhoto,
} from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { BiCamera } from "react-icons/bi";

const ProfileView = () => {
	const {
		user,
		userfollowinglist,
		followinglistTotalNumber,
		fetchingFollowingListStatus,
		userFollowerslist,
		followerslistTotalNumber,
		fetchingFollowersListStatus,
	} = useSelector((store) => store?.userSlice);
	// Custom toolbar component with an upload button
	const customToolbar = [
		{
			name: "upload",
			icon: "upload", // You can use an icon library or provide a custom icon
			title: "Upload",
			onClick: () => {
				// Trigger the upload when the button is clicked
				handleUpload(/* Pass the edited image here */);
				// Optionally, you can close the editor here
				setShow(false);
			},
		},
		// Add more buttons if needed
	];

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const _id = user?.id;
	const [show, toggle] = useState(false);
	const [src, setSrc] = useState(null);
	useEffect(() => {
		if (!_id) return;
		dispatch(setFirstFetchFollowingUser());
		dispatch(fetchUserFollowingList());
		dispatch(updateFollowingListPageNumber());
		dispatch(setFirstFetchFollowersUser());
		dispatch(fetchUserFollowersList());
	}, [_id]);
	const handleNavigateToFollowing = (e) => {
		e.preventDefault();
		navigate("/follows-following");
	};
	const handleNavigateToFollower = (e) => {
		e.preventDefault();
		navigate("/follows-followers");
	};
	if (!user) {
		return <h3 className=" text-black text-3xl">Loading ....</h3>;
	}
	return (
		<div className=" flex flex-col row-span-2 md:grid grid-cols-6 col-start-1 col-span-4 rounded-xl  lg:mb-6 pt-4 lg:shadow-sm lg:rounded-md lg:ml-0  font-inter gap-5 bg-white lg:bg-transparent">
			<FilerobotImageEditor
				show={show}
				src={src}
				customToolbar={customToolbar}
				onClose={() => {
					toggle(false);
				}}
			/>
			<div className=" col-start-1 col-span-4  bg-white lg:shadow-sm lg:rounded-md">
				<div className="w-full relative ">
					<div className=" w-full relative ">
						<img
							src={user?.profilePhoto}
							alt=""
							className=" h-28  w-full"
						/>
						<label className=" absolute bottom-0 right-0  text-center px-1 flex items-center justify-center bg-blue-200 drop-shadow-md hover:drop-shadow-sm hover:bg-blue-300 transition-all delay-75  h-12 w-12 rounded-full ">
							<input
								onChange={(e) => {
									setSrc(URL.createObjectURL(e.currentTarget.files[0]));
									toggle(true);
								}}
								type="file"
								name="image"
								id="image"
								className="hidden z-50"
							/>

							<BiCamera className=" text-4xl fill-white -rotate-3" />
						</label>
					</div>
					<img
						src={user?.profilePhoto}
						alt=""
						className="absolute top-1/4 left-8 w-16 h-16 md:w-32 md:h-32 rounded-full"
					/>
					<UserProfile />
				</div>
				{/* summary */}
				<UserBio />
			</div>

			{/* profile Additional details */}
			<AdditionalUserProfile />

			{/* following  */}
			<div className=" md:col-start-1 col-span-3  ">
				<h1 className="font-semibold  max-w-max pt-3 pb-1 ">following</h1>

				<FollowUsersList
					list={userfollowinglist}
					listTotalNumber={followinglistTotalNumber}
					fetchingListStatus={fetchingFollowingListStatus}
					_id={_id}
					isProfileView={true}
					fetchAction={handleNavigateToFollowing}
					title={"following"}
				/>
			</div>
			{/* followers  */}
			<div className=" md:col-start-4 col-span-full">
				<h1 className="font-semibold  max-w-max pt-3 pb-1 ">followers</h1>

				<FollowUsersList
					list={userFollowerslist}
					listTotalNumber={followerslistTotalNumber}
					fetchingListStatus={fetchingFollowersListStatus}
					_id={_id}
					isProfileView={true}
					fetchAction={handleNavigateToFollower}
					title={"followers"}
				/>
			</div>
		</div>
	);
};

export default ProfileView;
