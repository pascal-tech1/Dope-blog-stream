import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch from "../../utils/axios";

export const fetchPostByCategory = createAsyncThunk(
	"fetch/PostByCategory",
	async (params, { getState, rejectWithValue, dispatch }) => {
		let { page, postNumberPerPage, activeCategory, searchQuery } =
			getState().allPostSlice;
		if (params?.where === "morePost") {
			searchQuery = "";
		}
		const newPage = params?.page || page;
		const newPostNumberPerPaage =
			params?.postNumberPerPage || postNumberPerPage;

		try {
			const resp = await customFetch(
				`/posts/?page=${newPage}&postNumberPerPage=${newPostNumberPerPaage}&category=${activeCategory}&searchQuery=${searchQuery}&where=${params?.where}`
			);

			return { data: resp.data, fromWhere: params?.where };
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
	isLoading: false,
	allPost: [],
	page: 1,
	postNumberPerPage: 10,
	searchQuery: "",
	hasMore: true,
	activeCategory: "all",
	morePost: [],
	morePostStatus: "idle",
	morePostHasMore: true,
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
		clearMorePost: (state) => {
			state.morePost = [];
			state.morePostHasMore = true;
		},
	},

	extraReducers: {
		[fetchPostByCategory.pending]: (state, action) => {
			state.isLoading = true;
		},
		[fetchPostByCategory.fulfilled]: (state, { payload }) => {
			if (payload?.fromWhere === "morePost") {
				if (payload.data.length < 10) {
					state.morePostHasMore = false;
					state.morePost = [...state.morePost, ...payload.data];
				} else {
					state.morePost = [...state.morePost, ...payload.data];
				}
				state.morePostStatus = false;
			} else {
				if (payload.data.length < 10) {
					state.hasMore = false;
					state.allPost = [...state.allPost, ...payload.data];
				} else {
					state.allPost = [...state.allPost, ...payload.data];
				}
			}
			state.isLoading = false;
		},
		[fetchPostByCategory.rejected]: (state, { payload }) => {
			state.isLoading = false;
			if (payload?.fromWhere === "morePost") {
				toast.error("fetching more Post faild try again later");
			} else {
				toast.error("fetching post failed try again later");
			}
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
	setEmptySearch,
	clearMorePost,
} = allPostSlice.actions;
export default allPostSlice.reducer;
