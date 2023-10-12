import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import allPostSlice from "./post/allPostSlice";
import singlePostSlice from "./post/singlePostSlice";
import morePostSlice from "./post/morePostSlice";
import generalPostSlice from "./post/generalPostSlice";
import categorySlice from "./category/categorySlice";

export const store = configureStore({
	reducer: {
		userSlice,
		allPostSlice,
		singlePostSlice,
		morePostSlice,
		generalPostSlice,
		categorySlice,
	},
});
