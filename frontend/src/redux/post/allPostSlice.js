import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch from "../../utils/axios";

export const fetchAllPost = createAsyncThunk(
	"fetchAll/Post",
	async (postNumberPerPage, { getState, rejectWithValue, dispatch }) => {
		const { page } = getState().allPostSlice;
		try {
			const resp = await customFetch(
				`/posts?page=${page}&postNumberPerPage=${postNumberPerPage}`
			);
			return resp.data;
		} catch (error) {
			if (!error?.response) {
				throw new Error();
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const searchPost = createAsyncThunk(
	"search/Post",
	async (_, { getState, rejectWithValue, dispatch }) => {
		const { page, postNumberPerPage, searchQuery } =
			getState().allPostSlice;

		try {
			const resp = await customFetch(
				`/posts/search?page=${page}&postNumberPerPage=${postNumberPerPage}&searchQuery=${searchQuery}`
			);
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
	allPost: [],
	page: 1,
	postNumberPerPage: 10,
	searchQuery: null,
	hasMore: true,
};

const allPostSlice = createSlice({
	name: "allPostSlice",
	initialState,

	reducers: {
		setFirstSearch: (state, { payload }) => {
			state.searchQuery = payload;
			state.allPost = [];
			state.page = 1;
			state.hasMore = true;
		},
		setSearchPage: (state, { payload }) => {
			state.page = state.page + 1;
		},
		updateNumbPostViewInAllPostSlice: (state, { payload }) => {
			state.allPost.map((post) => {
				if (post._id === payload.id) {
					post.numViews = payload.numViews;
				}
			});
		},
		updateSinglePost: (state, { payload }) => {
			const index = state.allPost.findIndex(
				(post) => post.id === payload.id
			);
			const post = state.allPost[index];

			state.allPost[index] = { ...post, ...payload.post };
		},
		togleAllPostLikesAndDisLikes: (state, { payload }) => {
			const { postId, likes, disLikes } = payload;
			state.allPost?.map((post) => {
				if (post?._id === postId) {
					post.likes = likes;
					post.disLikes = disLikes;
				}
			});
		},
	},

	extraReducers: {
		// fetch all post
		[fetchAllPost.pending]: (state, action) => {
			state.isLoading = true;
		},
		[fetchAllPost.fulfilled]: (state, action) => {
			if (action.payload.length < 10) {
				state.hasMore = false;
				state.allPost = [...state.allPost, ...action.payload];
			} else {
				state.allPost = [...state.allPost, ...action.payload];
			}
			state.isLoading = false;

			state.serverErr = undefined;
			state.appErr = undefined;
		},
		[fetchAllPost.rejected]: (state, action) => {
			(state.isLoading = false),
				(state.serverErr = action?.error?.message);
			state.appErr = action?.payload?.message;
		},

		// search post
		[searchPost.pending]: (state, action) => {
			state.isLoading = true;
		},
		[searchPost.fulfilled]: (state, action) => {
			if (action.payload.length < 10) {
				state.hasMore = false;
				state.allPost = [...state.allPost, ...action.payload];
			} else {
				state.allPost = [...state.allPost, ...action.payload];
			}
			state.isLoading = false;

			state.serverErr = undefined;
			state.appErr = undefined;
		},
		[searchPost.rejected]: (state, action) => {
			(state.isLoading = false),
				(state.serverErr = action?.error?.message);
			state.appErr = action?.payload?.message;
			state.appErr
				? toast.error(state.appErr)
				: toast.error(state.serverErr);
		},
	},
});
export const {
	togleAllPostLikesAndDisLikes,
	setSearchPage,
	setFirstSearch,
	updateNumbPostViewInAllPostSlice,
	updateSinglePost,
} = allPostSlice.actions;
export default allPostSlice.reducer;
