import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import  allPostSlice from "../redux/post/postSlice"


export const store = configureStore({
	reducer: {
		userSlice: userSlice,
		allPostSlice: allPostSlice
	},
});
