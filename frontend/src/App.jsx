import React, { Suspense, lazy, useEffect, useState } from "react";

import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	useNavigate,
} from "react-router-dom";

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
} from "./pages/Dashboard";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserFromLocalStorage } from "./utils/localStorage";
import { useDispatch, useSelector } from "react-redux";
import { loginUserWithToken } from "./redux/user/userSlice";
import { AllUsers, AllUsersPost, AdminAllCategory } from "./AdminPages";
import { CropImage } from "./components";
import ComfirmEmailPage from "./pages/ComfirmEmailPage";
import PagesLayout from "./pages/PagesLayout";
import { useDarkMode } from "./customHooks";
const AdminProtectedPage = lazy(() =>
	import("./pages/AdminProtectedPage")
);

const Layout = lazy(() => import("./pages/Dashboard/Layout"));
const App = () => {
	const { token } = useSelector((store) => store.userSlice);
	const theme = localStorage.getItem("theme");

	const isSystemInDakMode = useDarkMode();

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
	const dispatch = useDispatch();

	const userToken = getUserFromLocalStorage();
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
					<Route path="/update-password" element={<UpdatePassword />} />
					<Route
						path="/confirm-sent-email/:token"
						element={<ComfirmEmailPage />}
					/>
					<Route
						path="/send-email-verification"
						element={<VerifyEmail />}
					/>
					<Route path="*" element={<Error />} />
				</Route>

				<Route
					element={
						<Suspense fallback={<div>loading..</div>}>
							<Layout />
						</Suspense>
					}
				>
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
						<Route
							path="Admin-All Users"
							element={
								<Suspense>
									<AllUsers />
								</Suspense>
							}
						/>
						<Route
							path="Admin-All Posts"
							element={
								<Suspense>
									<AllUsersPost />
								</Suspense>
							}
						/>
						<Route
							path="Admin-Category"
							element={
								<Suspense>
									<AdminAllCategory />
								</Suspense>
							}
						/>
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
