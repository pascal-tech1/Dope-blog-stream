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
	async (postNumberPerPage, { rejectWithValue }) => {
		const page = 1;
		const activeCategory = "all";

		try {
			const resp = await customFetch(
				`/posts/randomPost?page=${page}&postNumberPerPage=${postNumberPerPage}&category=${activeCategory}`
			);
			return resp.data;
		} catch (error) {
			console.log(error);
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const fetchSavedPosts = createAsyncThunk(
	"fetch/SavedPosts",
	async (page, { getState, rejectWithValue }) => {
		console.log("im her histsssssssssssss");
		const { postNumberPerPage } = getState().morePostSlice;

		try {
			const resp = await customFetch(
				`/posts/user-savedPost?page=${page}&postNumberPerPage=${postNumberPerPage}`,
				{
					headers: {
						Authorization: `Bearer ${getState().userSlice.token}`,
					},
				}
			);
			console.log(resp.data);
			return resp.data;
		} catch (error) {
			console.log(error);
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const fetchUserPostHistory = createAsyncThunk(
	"fetch/userPostHistory",
	async (historyPageNumber, { getState, rejectWithValue }) => {
		console.log("im her history");
		const { postNumberPerPage } = getState().morePostSlice;

		try {
			const resp = await customFetch(
				`/posts/user-history?page=${historyPageNumber}&postNumberPerPage=${postNumberPerPage}`,
				{
					headers: {
						Authorization: `Bearer ${getState().userSlice.token}`,
					},
				}
			);
			console.log(resp.data);
			return resp.data;
		} catch (error) {
			console.log(error);
			if (!error?.response) {
				throw new Error(error);
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
	userPostHistoryStatus: "idle",
	userPostHistory: [],
	userSavedPost: [],
	postNumberPerPage: 10,
	userSavedPostStatus: "idle",
	savedPostPageNumber: 1,
	historyPageNumber: 1,
	historyHasMore: true,
	savedPostHasMore: true,
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

		clearUserPost: (state, { payload }) => {
			state.userPost = [];
		},
		IncreaseHistoryPageNumber: (state) => {
			state.historyPageNumber = state.historyPageNumber + 1;
		},
		IncreaseSavedPostPageNumber: (state) => {
			state.savedPostPageNumber = state.savedPostPageNumber + 1;
		},
		setHistoryFirstSearch: (state) => {
			state.userPostHistory = [];
			state.historyPageNumber;
			state.historyHasMore = true;
		},
		setSavedPostFirstSearch: (state) => {
			state.userSavedPost = [];
			state.savedPostHasMore = true;
		},
		updateUserViewHistory: (state, { payload }) => {
			state.userPostHistory = state.userPostHistory.filter(
				(post) => post._id !== payload._id
			);
			state.userPostHistory = [payload, ...state.userPostHistory];
		},
		updateUserSavedPost: (state, { payload }) => {
			state.userSavedPost = state.userSavedPost.filter(
				(post) => post._id !== payload._id
			);
			state.userSavedPost = [payload, ...state.userSavedPost];
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
			console.log(action.payload);
			state.morePostStatus = "failed";
		},
		[fetchUserPostHistory.pending]: (state, action) => {
			state.userPostHistoryStatus = "loading";
		},
		[fetchUserPostHistory.fulfilled]: (state, { payload }) => {
			state.userPostHistoryStatus = "success";
			if (state.userPostHistory.length < payload.totalPostHistory) {
				state.historyHasMore = true;
				state.userPostHistory = [
					...state.userPostHistory,
					...payload.posts,
				];
			} else {
				state.historyHasMore = false;
			}
		},
		[fetchUserPostHistory.rejected]: (state, action) => {
			state.userPostHistoryStatus = "failed";
		},
		[fetchSavedPosts.pending]: (state, action) => {
			state.userSavedPostStatus = "loading";
		},
		[fetchSavedPosts.fulfilled]: (state, { payload }) => {
			state.userSavedPostStatus = "success";
			if (state.userSavedPost.length < payload.totalSavedPosts) {
				state.savedPostHasMore = true;
				state.userSavedPost = [...state.userSavedPost, ...payload.posts];
			} else {
				state.savedPostHasMore = false;
			}
		},
		[fetchSavedPosts.rejected]: (state, action) => {
			console.log(action);
			state.userSavedPostStatus = "failed";
		},
	},
});

export default morePostSlice.reducer;
export const {
	togleMorePostLikesAndDisLikes,
	updateNumbPostViewInMorePostSlice,
	IncreaseHistoryPageNumber,
	IncreaseSavedPostPageNumber,
	setHistoryFirstSearch,
	setSavedPostFirstSearch,
	updateUserViewHistory,
	updateUserSavedPost,
	clearUserPost,
} = morePostSlice.actions;
