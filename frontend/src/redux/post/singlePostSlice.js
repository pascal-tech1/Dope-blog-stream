import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import customFetch from "../../utils/axios";
import { toast } from "react-toastify";
import { updateNumbOfPostView, updateSinglePost } from "./allPostSlice";

export const fetchSinglePost = createAsyncThunk(
	"fetchSingle/Post",
	async (id, { getState, rejectWithValue, dispatch }) => {
		const userToken = getState().userSlice?.token;

		try {
			const resp = await customFetch.put(`/posts/${id}`, {
				userToken,
			});
			dispatch(
				updateNumbOfPostView({ id: id, numViews: resp.data.numViews })
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
export const createPost = createAsyncThunk(
	"create/Post",
	async (post, { getState, rejectWithValue, dispatch }) => {
		console.log("im heree today");
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
};
const singlePostSlice = createSlice({
	name: "singlePostSlice",
	initialState,

	reducers: {
		updatePostLikesAndDisLikes: (state, { payload }) => {
			state.post.likes = payload.likes;
			state.post.disLikes = payload.disLikes;
		},
		setIsEditingPost: (state, { payload }) => {
			state.isEditing = payload;
		},
		setSinglePostStatus: (state, { payload }) => {
			state.status = payload;
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
			state.appErr
				? toast.error(state.appErr)
				: toast.error(state.serverErr);
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
	updatePostLikesAndDisLikes,
	setIsEditingPost,
	setSinglePostStatus,
} = singlePostSlice.actions;
export default singlePostSlice.reducer;
