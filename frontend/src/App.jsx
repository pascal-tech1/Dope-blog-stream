import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home, Login, Register } from "./pages";
import {
	Comments,
	Dashboard,
	Followers,
	Layout,
	MessagesSend,
	MessagesView,
	Post,
	ProfileEdit,
	ProfileView,
} from "./pages/Dashboard";
import Carousel from "./utils/carousel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
			
				<Route path="/" element={<Home />} />
				<Route path="/dashboard" element={<Layout />}>
					<Route index path="dashboard" element={<Dashboard />} />
					<Route path="profile-view" element={<ProfileView />} />
					<Route path="profile-edit" element={<ProfileEdit />} />
					<Route path="post" element={<Post />} />
					<Route path="followers" element={<Followers />} />
					<Route path="messages-view" element={<MessagesView />} />
					<Route path="messages-send" element={<MessagesSend />} />

					<Route path="comments" element={<Comments />} />
				</Route>
				<Route path="login" element={<Login/>} />
				<Route path="register" element={<Register/>} />
				<Route path="*" element={<Error />} />
			</Routes>
			<ToastContainer position="top-center" />
		</BrowserRouter>
	);
};

export default App;
