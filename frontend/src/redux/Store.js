import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import allPostSlice from "./post/allPostSlice";
import singlePostSlice from "./post/singlePostSlice";
import morePostSlice from "./post/morePostSlice";
import generalPostSlice from "./post/generalPostSlice";

export const store = configureStore({
	reducer: {
		userSlice,
		allPostSlice,
		singlePostSlice,
		morePostSlice,
		generalPostSlice,
	},
});
