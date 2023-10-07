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
		console.log(postId);
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
			console.log(error);
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

const initialState = {
	post: [],
};

const generalPostSlice = createSlice({
	name: "generaPostSlice",
	initialState,

	extraReducers: {
		// like or dislike post
		[likeOrDislikePost.pending]: (state, action) => {
			state.isLoading = true;
		},
		[likeOrDislikePost.fulfilled]: (state, action) => {
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
	},
});

export default generalPostSlice.reducer;
