import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch from "../../utils/axios";

export const fetchPostByCategory = createAsyncThunk(
	"fetch/PostByCategory",
	async (_, { getState, rejectWithValue, dispatch }) => {
		const { page, postNumberPerPage, activeCategory, searchQuery } =
			getState().allPostSlice;
		try {
			const resp = await customFetch(
				`/posts/?page=${page}&postNumberPerPage=${postNumberPerPage}&category=${activeCategory}&searchQuery=${searchQuery}`
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
	searchQuery: "",
	hasMore: true,
	activeCategory: "all",
	displayedCategory: ["all", "react", "javascript"],
	undisplayedCategory: [],
	
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
		setEmptySearch: (state, { payload }) => {
			state.searchQuery = "";
			state.allPost = [];
			state.page = 1;
			state.hasMore = true;
		},
		IncreasePageNumber: (state, { payload }) => {
			state.page = state.page + 1;
		},
		setFetchFirstCategory: (state, { payload }) => {
			state.activeCategory = payload;
			state.allPost = [];
			state.page = 1;
			state.hasMore = true;
		},

		setActiveCategory: (state, { payload }) => {
			state.activeCategory = payload;
		},
		toggleDisplayedCategory: (state, { payload }) => {
			console.log("im here");
			state.displayedCategory.pop();
			state.displayedCategory.push(payload);
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
		[fetchPostByCategory.pending]: (state, action) => {
			state.isLoading = true;
		},
		[fetchPostByCategory.fulfilled]: (state, action) => {
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
		[fetchPostByCategory.rejected]: (state, action) => {
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
	IncreasePageNumber,
	setFirstSearch,
	updateNumbPostViewInAllPostSlice,
	updateSinglePost,
	setFetchFirstCategory,
	setActiveCategory,
	toggleDisplayedCategory,
	setEmptySearch,
} = allPostSlice.actions;
export default allPostSlice.reducer;
