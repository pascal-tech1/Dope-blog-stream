import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home, Login } from "./pages";
import {
	Comments,
	Dashboard,
	Followers,
	Layout,
	Messages,
	Post,
	Profile,
} from "./pages/Dashboard";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="profile" element={<Profile />} />
					<Route path="post" element={<Post />} />
					<Route path="followers" element={<Followers />} />
					<Route path="messages" element={<Messages />} />
					<Route path="comments" element={<Comments />} />
				</Route>
				{/* <Route path="pages" element={<Pages />}>
					
				</Route> */}
				<Route path="home" element={<Home />} />
				<Route path="*" element={<Error />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
