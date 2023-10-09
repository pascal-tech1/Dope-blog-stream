import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import customFetch from "../../utils/axios";
import { toast } from "react-toastify";
import { updateSinglePost } from "./allPostSlice";
import { updateNumbPostViewInMorePostSlice } from "./morePostSlice";

export const fetchSinglePost = createAsyncThunk(
	"fetchSingle/Post",
	async (id, { getState, rejectWithValue, dispatch }) => {
		const userToken = getState().userSlice?.token;

		try {
			const resp = await customFetch.put(`/posts/${id}`, {
				userToken,
			});

			dispatch(
				updateNumbPostViewInMorePostSlice({
					id: id,
					numViews: resp.data.numViews,
				})
			);

			return resp.data;
		} catch (error) {
			console.log(error);
			if (!error?.response) {
				throw new Error();
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const fetchPostToBeEdited = createAsyncThunk(
	"fetchPostToBeEdited/Post",
	async (id, { getState, rejectWithValue, dispatch }) => {
		const userToken = getState().userSlice?.token;

		try {
			const resp = await customFetch.put(`/posts/${id}`, {
				userToken,
			});

			return resp.data;
		} catch (error) {
			console.log(error);
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
					authorization: `Bearer ${getState().userSlice?.token}`,
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
export const updatePost = createAsyncThunk(
	"update/post",
	async (post, { getState, rejectWithValue, dispatch }) => {
		const postId = getState().singlePostSlice.post?._id;

		try {
			const resp = await customFetch.put(`/posts/update/${postId}`, post, {
				headers: {
					"Content-Type": "multipart/form-data",
					authorization: `Bearer ${getState().userSlice?.token}`,
				},
			});

			dispatch(updateSinglePost({ id: postId, post: resp.data }));
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
	post: null,
	status: "idle",
	isEditing: false,
	editingPost: null,
	postToBeEdited: [],
	postEditingStatus: "idle",
};
const singlePostSlice = createSlice({
	name: "singlePostSlice",
	initialState,

	reducers: {
		togleSinglePostLikesAndDisLikes: (state, { payload }) => {
			const { postId, likes, disLikes } = payload;
			if (state.post?._id === postId) {
				state.post.likes = likes;
				state.post.disLikes = disLikes;
			}
		},
		setIsEditingPost: (state, { payload }) => {
			state.isEditing = payload;
		},
		setSinglePostStatus: (state, { payload }) => {
			state.status = payload;
		},
		setPostToBeEdited: (state, { payload }) => {
			state.postToBeEdited = payload;
		},
	},

	extraReducers: {
		// fetch single post
		[fetchSinglePost.pending]: (state, action) => {
			state.status = "loading";
		},
		[fetchSinglePost.fulfilled]: (state, action) => {
			state.status = "success";
			state.post = action.payload;
			state.serverErr = undefined;
			state.appErr = undefined;
		},
		[fetchSinglePost.rejected]: (state, action) => {
			state.status = "error";
			state.serverErr = action?.error?.message;
			state.appErr = action?.payload?.message;
		},
		[fetchPostToBeEdited.pending]: (state, action) => {
			state.postEditingStatus = "loading";
		},
		[fetchPostToBeEdited.fulfilled]: (state, action) => {
			state.postEditingStatus = "success";
			state.postToBeEdited = action.payload;
		},
		[fetchPostToBeEdited.rejected]: (state, action) => {
			state.postEditingStatus = "success";
			toast.error("failed to fetch Post");
		},
		// create post
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
		// update post
		[updatePost.pending]: (state, action) => {
			state.isLoading = true;
		},
		[updatePost.fulfilled]: (state, action) => {
			state.isEditing = false;
			state.post = action.payload;
			state.isLoading = false;
			state.serverErr = undefined;
			state.appErr = undefined;
			toast.success("Post Updated Successfully");
		},
		[updatePost.rejected]: (state, action) => {
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
	togleSinglePostLikesAndDisLikes,
	setIsEditingPost,
	setSinglePostStatus,

	setPostToBeEdited,
} = singlePostSlice.actions;
export default singlePostSlice.reducer;
