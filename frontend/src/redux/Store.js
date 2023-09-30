import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import allPostSlice from "./post/allPostSlice";
import singlePostSlice from "./post/singlePostSlice";

export const store = configureStore({
	reducer: {
		userSlice: userSlice,
		allPostSlice: allPostSlice,
		singlePostSlice: singlePostSlice,
	},
});
