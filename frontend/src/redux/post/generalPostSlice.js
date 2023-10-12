import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { togleSinglePostLikesAndDisLikes } from "./singlePostSlice";
import { togleAllPostLikesAndDisLikes } from "./allPostSlice";
import { togleMorePostLikesAndDisLikes } from "./morePostSlice";
import customFetch from "../../utils/axios";
import { toast } from "react-toastify";

export const likeOrDislikePost = createAsyncThunk(
	"like/DislikePost",
	async (data, { getState, rejectWithValue, dispatch }) => {
		const { postId, choice } = data;
		try {
			const resp = await customFetch.put(
				`/posts/${choice}`,
				{ postId },
				{
					headers: {
						authorization: `Bearer ${getState().userSlice?.token}`,
					},
				}
			);

			const disLikes = resp.data.disLikes;
			const likes = resp.data.likes;
			dispatch(
				togleSinglePostLikesAndDisLikes({ likes, disLikes, postId })
			);
			dispatch(togleAllPostLikesAndDisLikes({ likes, disLikes, postId }));
			dispatch(togleMorePostLikesAndDisLikes({ likes, disLikes, postId }));

			return {
				postId,
				disLikes,
				likes,
				choice,
			};
		} catch (error) {
			console.log(error)
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const fetchPostCreatorProfile = createAsyncThunk(
	"fetch/postcreatorProfile",
	async (userId, { rejectWithValue, getState, dispatch }) => {
		console.log(userId);
		try {
			const resp = await customFetch(`/users/profile/${userId}`);
			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error();
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const fetchCreatorPosts = createAsyncThunk(
	"fetch/creatorPost",
	async (postAndUserId, { getState, rejectWithValue }) => {
		const { page } = postAndUserId;
		const postNumberPerPage = 10;
		try {
			const resp = await customFetch.put(
				`/posts/user-post?page=${page}&postNumberPerPage=${postNumberPerPage}`,
				postAndUserId
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

const initialState = {
	postCreatorProfile: null,
	postCreatorProfileStatus: "idle",
	creatorAllPost: [],
	creatorAllPostTotalPages: 1,
};

const generalPostSlice = createSlice({
	name: "generaPostSlice",
	initialState,
	reducers: {
		clearCreatorAllPost: (state) => {
			state.creatorAllPost = [];
		},
	},

	extraReducers: {
		// like or dislike post
		[likeOrDislikePost.pending]: (state, action) => {
			state.isLoading = true;
		},
		[likeOrDislikePost.fulfilled]: (state, { payload }) => {
			state.creatorAllPost.map((post) => {
				
				if (post?._id === payload?.postId) {
					
					console.log("im here liking or dislii post");
					post.likes = payload.likes;
					post.disLikes = payload.disLikes;
				}
			});
			state.isLoading = false;
			state.serverErr = undefined;
			state.appErr = undefined;
		},
		[likeOrDislikePost.rejected]: (state, action) => {
			(state.isLoading = false),
				(state.serverErr = action?.error?.message);
			state.appErr = action?.payload?.message;
			state.appErr
				? toast.error(state.appErr)
				: toast.error(state.serverErr);
		},
		[fetchPostCreatorProfile.pending]: (state) => {
			state.postCreatorProfileStatus = "loading";
		},
		[fetchPostCreatorProfile.fulfilled]: (state, { payload }) => {
		
			state.postCreatorProfileStatus = "success";
			state.postCreatorProfile = payload;
		},
		[fetchPostCreatorProfile.rejected]: (state, action) => {
			state.postCreatorProfileStatus = "failed";
		},
		[fetchCreatorPosts.pending]: (state) => {
			state.creatorPostStatus = "loading";
		},
		[fetchCreatorPosts.fulfilled]: (state, { payload }) => {
			state.creatorPostStatus = "success";

			state.creatorAllPost = [...state.creatorAllPost, ...payload.posts];
			state.creatorAllPostTotalPages = payload.totalPages;
		},
		[fetchCreatorPosts.rejected]: (state, action) => {
			console.log(action.payload);
			state.creatorPostStatus = "failed";
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			toast.error(action?.payload?.message);
		},
	},
});

export default generalPostSlice.reducer;
export const { clearCreatorAllPost } = generalPostSlice.actions;
