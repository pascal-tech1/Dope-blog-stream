import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import customFetch from "../../utils/axios";

export const fetchAllPost = createAsyncThunk(
	"fetch/Post",
	async (user, { getState, rejectWithValue, dispatch }) => {
		try {
			const resp = await customFetch("/posts", user);
			return resp.data;
		} catch (error) {
			if (!error?.response) {
				throw new Error();
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

const initialState = {
	isLoading: false,
	allPost: null,
};

const allPostSlice = createSlice({
	name: "allPostSlice",
	initialState,

	extraReducers: {
		[fetchAllPost.pending]: (state, action) => {
			state.isLoading = true;
		},
		[fetchAllPost.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.allPost = action.payload;
			state.serverErr = undefined;
			state.appErr = undefined;
			
		},
		[fetchAllPost.rejected]: (state, action) => {
			(state.isLoading = false),
				(state.serverErr = action?.error?.message);
			state.appErr = action?.payload?.message;
			console.log(action);
		},
	},
});

export default allPostSlice.reducer;
