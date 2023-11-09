import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import customFetch from "../../utils/axios";
import { toast } from "react-toastify";

export const fetchAllUsersPost = createAsyncThunk(
	"fetch/AllUsersPost",
	async (params, { getState, rejectWithValue }) => {
		const postNumberPerPage = 12;
		const { adminAllPostPageNumber } = getState().adminSlice;
		console.log(adminAllPostPageNumber);
		try {
			const resp = await customFetch(
				`/posts/admin-all-post?page=${adminAllPostPageNumber}&postNumberPerPage=${postNumberPerPage}&filter=${params.filter}`,
				{
					headers: {
						authorization: `Bearer ${getState().userSlice?.token}`,
					},
				}
			);

			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error();
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const deletePostAdmin = createAsyncThunk(
	"delete/PostAdmin",
	async (postIds, { getState, rejectWithValue, dispatch }) => {
		try {
			const resp = await customFetch.post(
				`/posts/delete`,
				{ postIds },
				{
					headers: {
						authorization: `Bearer ${getState().userSlice?.token}`,
					},
				}
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
	hasMore: true,
	allPost: [],
	MyPostSelectedFilter: "Category",
	adminAllPostStatus: "idle",
	adminAllPostTotalNumber: null,
	adminAllPostTotalPages: null,
	deletingPostStatus: "idle",
	adminAllPostPageNumber: 1,
};

const adminSlice = createSlice({
	name: "adminSlice",
	initialState,
	reducers: {
		clearAdminAllPost: (state) => {
			state.adminAllPostPageNumber = 1;
			state.hasMore = true;
			state.allPost = [];
		},
		setMyPostSelectedFilter: (state, { payload }) => {
			state.MyPostSelectedFilter = payload;
		},
		increaseAdminAllPostPageNumber: (state) => {
			state.adminAllPostPageNumber += 1;
		},
	},
	extraReducers: {
		[fetchAllUsersPost.pending]: (state) => {
			state.adminAllPostStatus = "loading";
		},
		[fetchAllUsersPost.fulfilled]: (state, { payload }) => {
			state.adminAllPostStatus = "success";

			state.adminAllPostTotalNumber = payload.totalNumber;
			state.allPost = [...state.allPost, ...payload.posts];
			state.adminAllPostTotalPages = payload.totalPages;

			if (payload.posts.length < 10) state.hasMore = false;
			else state.hasMore = true;
		},
		[fetchAllUsersPost.rejected]: (state, action) => {
			state.adminAllPostStatus = "failed";
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			toast.error(action?.payload?.message);
		},
		// user delete posts
		[deletePostAdmin.pending]: (state) => {
			state.deletingPostStatus = "loading";
		},
		[deletePostAdmin.fulfilled]: (state, { payload }) => {
			state.deletingPostStatus = "success";
			const { postIds } = payload;
			console.log(postIds);
			state.adminAllPostTotalNumber -= 1;
			state.allPost = state.allPost.filter(
				(post) => !postIds.includes(post._id)
			);
			toast.success(payload.message);
		},
		[deletePostAdmin.rejected]: (state, action) => {
			state.deletingPostStatus = "falied";
			toast.error(payload.message);
		},
	},
});

export const {
	clearAdminAllPost,
	setMyPostSelectedFilter,
	increaseAdminAllPostPageNumber,
} = adminSlice.actions;
export default adminSlice.reducer;
