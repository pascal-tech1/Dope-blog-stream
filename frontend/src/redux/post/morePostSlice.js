import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import customFetch from "../../utils/axios";

export const fetchUserPost = createAsyncThunk(
	"User/post",
	async (id, { getState, rejectWithValue }) => {
		const page = 1;
		const postNumberPerPage = 4;
		try {
			const resp = await customFetch.put(
				`/posts/user-post?page=${page}&postNumberPerPage=${postNumberPerPage}`,
				id
			);

			return resp.data;
		} catch (error) {}
	}
);

export const fetchMorePost = createAsyncThunk(
	"fetchMore/Post",
	async (postNumberPerPage, { getState, rejectWithValue, dispatch }) => {
		const page = 1;
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

const initialState = {
	userPost: [],
	userPostStatus: "idle",
	isLoading: false,
	morePost: [],
	morePostStatus: "idle",
};

const morePostSlice = createSlice({
	name: "morePostSlice",
	initialState,
	reducers: {
		togleMorePostLikesAndDisLikes: (state, { payload }) => {
			const { postId, likes, disLikes } = payload;
			state.morePost?.map((post) => {
				if (post?._id === postId) {
					post.likes = likes;
					post.disLikes = disLikes;
				}
			});
			state.userPost?.map((post) => {
				if (post?._id === postId) {
					post.likes = likes;
					post.disLikes = disLikes;
				}
			});
		},
		updateNumbPostViewInMorePostSlice: (state, { payload }) => {
			state.userPost.map((post) => {
				if (post._id === payload.id) {
					post.numViews = payload.numViews;
				}
			});
			state.morePost.map((post) => {
				if (post._id === payload.id) {
					post.numViews = payload.numViews;
				}
			});
		},
	},
	extraReducers: {
		// fetch  user creator Post
		[fetchUserPost.pending]: (state, action) => {
			state.userPostStatus = "loading";
		},
		[fetchUserPost.fulfilled]: (state, { payload }) => {
			state.userPostStatus = "success";

			state.userPost = payload.posts;
		},
		[fetchUserPost.rejected]: (state, action) => {
			state.userPostStatus = "error";
		},
		[fetchMorePost.pending]: (state, action) => {
			state.morePostStatus = "loading";
		},
		[fetchMorePost.fulfilled]: (state, action) => {
			state.morePost = action.payload;
			state.morePostStatus = "success";
		},
		[fetchMorePost.rejected]: (state, action) => {
			state.morePostStatus = "failed";
		},
	},
});

export default morePostSlice.reducer;
export const {
	togleMorePostLikesAndDisLikes,
	updateNumbPostViewInMorePostSlice,
} = morePostSlice.actions;
