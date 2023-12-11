import React, { useEffect } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import {
	Home,
	Login,
	Register,
	SinglePost,
	UserPage,
	Error,
	VerifyEmail,
	PasswordReset,
	UpdatePassword,
} from "./pages";
import {
	Comments,
	Dashboard,
	Followers,
	Layout,
	CreatePost,
	ProfileEdit,
	ProfileView,
	PostHistory,
	SavedPost,
	MyPosts,
	Following,
	Messages,
	WhoViewedMyProfile,
} from "./pages/Dashboard";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserFromLocalStorage } from "./utils/localStorage";
import { useDispatch, useSelector } from "react-redux";
import { loginUserWithToken } from "./redux/user/userSlice";
import { AllUsers, AllUsersPost, AdminAllCategory } from "./AdminPages";
import Image from "./Adoh/image";
import ComfirmEmailPage from "./pages/ComfirmEmailPage";
import PagesLayout from "./pages/PagesLayout";

const App = () => {
	const dispatch = useDispatch();
	const userToken = getUserFromLocalStorage();
	useEffect(() => {
		if (userToken) {
			dispatch(loginUserWithToken());
		}
	}, []);
	const { user } = useSelector((store) => store.userSlice);
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<PagesLayout />}>
					<Route path="/" element={<Home />} />
					<Route
						path="login"
						element={user ? <Navigate to="/" /> : <Login />}
					/>
					<Route
						path="register"
						element={user ? <Navigate to="/" /> : <Register />}
					/>
					<Route path="/image" element={<Image />} />
					<Route path="/single-post/:id" element={<SinglePost />} />
					<Route
						path="/reset-password/:token"
						element={<PasswordReset />}
					/>
					<Route path="/profile/:userId" element={<UserPage />} />
					<Route path="/update-password" element={<UpdatePassword />} />
					<Route
						path="/confirm-sent-email/:token"
						element={<ComfirmEmailPage />}
					/>
				</Route>

				<Route element={<Layout />}>
					<Route index path="stats" element={<Dashboard />} />
					<Route path="profile-view" element={<ProfileView />} />
					<Route path="profile-Message" element={<Messages />} />
					<Route
						path="profile-Profile Views"
						element={<WhoViewedMyProfile />}
					/>
					<Route path="post-My Posts" element={<MyPosts />} />
					<Route path="post-Create" element={<CreatePost />} />
					<Route path="post-History" element={<PostHistory />} />
					<Route path="post-Saved" element={<SavedPost />} />
					<Route path="followers" element={<Followers />} />

					<Route path="follows-followers" element={<Followers />} />
					<Route path="follows-following" element={<Following />} />
					<Route path="comments" element={<Comments />} />
					<Route path="Admin-All Users" element={<AllUsers />} />
					<Route path="Admin-All Posts" element={<AllUsersPost />} />
					<Route path="Admin-Category" element={<AdminAllCategory />} />
				</Route>

				<Route path="*" element={<Error />} />
			</Routes>
			<ToastContainer position="top-center" />
		</BrowserRouter>
	);
};

export default App;
