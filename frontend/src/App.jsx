import React, { Suspense, lazy, useEffect, useState } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import {
	Home,
	Login,
	Register,
	SinglePost,
	UserPage,
	VerifyEmail,
	PasswordReset,
	Error,
	ConfirmUserEmail,
} from "./pages";
import {
	Dashboard,
	Followers,
	CreatePost,
	ProfileView,
	PostHistory,
	SavedPost,
	MyPosts,
	Following,
	Messages,
	WhoViewedMyProfile,
	Layout,
} from "./pages/Dashboard";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { loginUserWithToken } from "./redux/user/userSlice";
import { AllUsers, AllUsersPost, AdminAllCategory } from "./AdminPages";
import { CropImage, LoadingSpinner } from "./components";

import PagesLayout from "./pages/PagesLayout";
import { useDarkMode } from "./customHooks";
import { getUserFromLocalStorage } from "./utils/localStorage";

const AdminProtectedPage = lazy(() =>
	import("./pages/AdminProtectedPage")
);

const App = () => {
	const { token, user, loginUserTokenStatus } = useSelector(
		(store) => store.userSlice
	);
	useEffect(() => {
		if (token) {
			dispatch(loginUserWithToken());
		}
	}, []);
	const theme = localStorage.getItem("theme");
	const dispatch = useDispatch();
	const isSystemInDakMode = useDarkMode();
	const userToken = getUserFromLocalStorage();

	useEffect(() => {
		if (!theme && isSystemInDakMode) {
			document.documentElement.classList.add("dark");
		} else if (!theme && !isSystemInDakMode) {
			document.documentElement.classList.remove("dark");
		} else if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else if (theme === "light") {
			document.documentElement.classList.remove("dark");
		}
	}, [theme, isSystemInDakMode]);

	useEffect(() => {
		if (userToken) {
			dispatch(loginUserWithToken());
		}
	}, []);

	useEffect(() => {
		const handleKeyPress = (e) => {
			if (e.key === "Escape") {
			}
			if (e.key === "Enter") {
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, []);
	if (loginUserTokenStatus === "loading" || !"undefine") {
		return (
			<div className=" grid place-content-center place-items-center h-screen dark:bg-dark">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route element={<PagesLayout />}>
					<Route path="/" element={<Home />} />
					<Route
						path="login"
						element={token ? <Navigate to="/" /> : <Login />}
					/>
					<Route
						path="register"
						element={token ? <Navigate to="/" /> : <Register />}
					/>
					<Route path="/image" element={<CropImage />} />
					<Route path="/single-post/:id" element={<SinglePost />} />
					<Route
						path="/reset-password/:token"
						element={<PasswordReset />}
					/>
					<Route
						path="/profile/:userId"
						element={token ? <UserPage /> : <Login />}
					/>

					<Route
						path="/confirm-sent-email/:token"
						element={<ConfirmUserEmail />}
					/>
					<Route
						path="/send-email-verification"
						element={<VerifyEmail />}
					/>
					<Route path="*" element={<Error />} />
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

					<Route
						element={
							<Suspense fallback={<div>loading..</div>}>
								<AdminProtectedPage />
							</Suspense>
						}
					>
						<Route path="Admin-All Users" element={<AllUsers />} />
						<Route path="Admin-All Posts" element={<AllUsersPost />} />
						<Route path="Admin-Category" element={<AdminAllCategory />} />
					</Route>
				</Route>
			</Routes>
			<ToastContainer
				position="top-right"
				draggable={true}
				className={` text-xs max-w-fit font-inter py-0 `}
				theme={theme ? theme : isSystemInDakMode ? "dark" : "light"}
			/>
		</BrowserRouter>
	);
};

export default App;
