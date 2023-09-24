import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

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
export const fetchSinglePost = createAsyncThunk(
	"fetchSingle/Post",
	async (id, { getState, rejectWithValue, dispatch }) => {
		try {
			const resp = await customFetch(`/posts/${id}`);
			return resp.data;
		} catch (error) {
			if (!error?.response) {
				throw new Error();
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const createPost = createAsyncThunk(
	"create/Post",
	async (post, { getState, rejectWithValue, dispatch }) => {
		try {
			const resp = await customFetch.post("/posts", post, {
				headers: {
					"Content-Type": "multipart/form-data",
					authorization: `Bearer ${getState().userSlice?.user?.token}`,
				},
			});

			return resp.data;
		} catch (error) {
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

const initialState = {
	isLoading: false,
	allPost: null,
	post: null,
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
		},
		[createPost.pending]: (state, action) => {
			state.isLoading = true;
		},
		[createPost.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.serverErr = undefined;
			state.appErr = undefined;
			toast.success("post created successfully");
		},
		[createPost.rejected]: (state, action) => {
			(state.isLoading = false),
				(state.serverErr = action?.error?.message);
			state.appErr = action?.payload?.message;
			state.appErr
				? toast.error(state.appErr)
				: toast.error(state.serverErr);
		},
		[fetchSinglePost.pending]: (state, action) => {
			state.isLoading = true;
		},
		[fetchSinglePost.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.post = action.payload;
			state.serverErr = undefined;
			state.appErr = undefined;
		},
		[fetchSinglePost.rejected]: (state, action) => {
			(state.isLoading = false),
				(state.serverErr = action?.error?.message);
			state.appErr = action?.payload?.message;
			state.appErr
				? toast.error(state.appErr)
				: toast.error(state.serverErr);
		},
	},
});

export default allPostSlice.reducer;
