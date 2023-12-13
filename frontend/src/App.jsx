import React, { Suspense, lazy, useEffect } from "react";

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
import { CropImage } from "./components";
import ComfirmEmailPage from "./pages/ComfirmEmailPage";
import PagesLayout from "./pages/PagesLayout";
const AdminProtectedPage = lazy(() =>
	import("./pages/AdminProtectedPage")
);

const App = () => {
	const dispatch = useDispatch();
	const userToken = getUserFromLocalStorage();
	useEffect(() => {
		if (userToken) {
			dispatch(loginUserWithToken());
		}
	}, []);
	const { user, token } = useSelector((store) => store.userSlice);

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
			<ToastContainer position="top-center" />
		</BrowserRouter>
	);
};

export default App;
