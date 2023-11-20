import React, { useEffect } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
	Home,
	Login,
	Register,
	SinglePost,
	UserPage,
	Error,
} from "./pages";
import {
	Comments,
	Dashboard,
	Followers,
	Layout,
	MessagesSend,
	MessagesView,
	CreatePost,
	ProfileEdit,
	ProfileView,
	PostHistory,
	SavedPost,
	MyPosts,
	Following,
} from "./pages/Dashboard";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserFromLocalStorage } from "./utils/localStorage";
import { useDispatch } from "react-redux";
import { loginUserWithToken } from "./redux/user/userSlice";
import { AllUsers, AllUsersPost, AdminAllCategory } from "./AdminPages";
import Image from "./Adoh/image";

const App = () => {
	const dispatch = useDispatch();
	const userToken = getUserFromLocalStorage();
	if (userToken) {
		dispatch(loginUserWithToken());
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/single-post/:id" element={<SinglePost />} />

				<Route element={<Layout />}>
					<Route index path="stats" element={<Dashboard />} />
					<Route path="profile-view" element={<ProfileView />} />
					<Route path="profile-edit" element={<ProfileEdit />} />
					<Route path="post-My Posts" element={<MyPosts />} />
					<Route path="post-Create" element={<CreatePost />} />
					<Route path="post-History" element={<PostHistory />} />
					<Route path="post-Saved" element={<SavedPost />} />
					<Route path="followers" element={<Followers />} />
					<Route path="messages-view" element={<MessagesView />} />
					<Route path="messages-send" element={<MessagesSend />} />
					<Route path="follows-followers" element={<Followers />} />
					<Route path="follows-following" element={<Following />} />
					<Route path="comments" element={<Comments />} />
					<Route path="Admin-All Users" element={<AllUsers />} />
					<Route path="Admin-All Posts" element={<AllUsersPost />} />
					<Route path="Admin-Category" element={<AdminAllCategory />} />
				</Route>

				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
				<Route path="/image" element={<Image />} />
				<Route path="/profile/:userId" element={<UserPage />} />
				<Route path="*" element={<Error />} />
			</Routes>
			<ToastContainer position="top-center" />
		</BrowserRouter>
	);
};

export default App;
