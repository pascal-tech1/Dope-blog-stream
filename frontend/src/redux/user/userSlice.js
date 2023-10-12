import customFetch from "../../utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import {
	addUserToLocalStorage,
	getUserFromLocalStorage,
	removeUserFromLocalStorage,
} from "../../utils/localStorage";

export const loginUser = createAsyncThunk(
	"user/loginUser",
	async (user, { rejectWithValue }) => {
		try {
			const resp = await customFetch.post("/users/login", user);
			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error();
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const loginUserWithToken = createAsyncThunk(
	"user/loginUserWithtoken",
	async (_, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch("/users/loginWithToken", {
				headers: {
					authorization: `Bearer ${getState().userSlice?.token}`,
				},
			});

			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error();
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const RegisterUser = createAsyncThunk(
	"user/RegisterUser",
	async (user, { rejectWithValue, getState, dispatch }) => {
		try {
			const resp = await customFetch.post("/users/register", user);

			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error();
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const updateUser = createAsyncThunk(
	"user/UpdateUser",
	async (user, { rejectWithValue, getState, dispatch }) => {
		const userId = getState().userSlice.user._id;

		try {
			const resp = await customFetch.put(`/users/${userId}`, user, {
				headers: {
					authorization: `Bearer ${getState().userSlice?.token}`,
				},
			});

			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error();
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const followOrUnfollowUser = createAsyncThunk(
	"followOrUnfollow/User",
	async (
		userToFollowOrUnfollowId,
		{ getState, rejectWithValue, dispatch }
	) => {
		const isfollowing = getState().userSlice.user?.following.includes(
			userToFollowOrUnfollowId
		);

		const followOrUnFollow = isfollowing ? "unfollow" : "follow";

		try {
			const resp = await customFetch.post(
				`users/${followOrUnFollow}`,
				{ userToFollowOrUnfollowId },
				{
					headers: {
						authorization: `Bearer ${getState().userSlice?.token}`,
					},
				}
			);

			return resp.data;
		} catch (error) {
			console.log(error)
			if (!error.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const savePost = createAsyncThunk(
	"save/Post",
	async (postId, { getState, rejectWithValue, dispatch }) => {
		try {
			const resp = await customFetch.post(
				`users/save-post`,
				{ postId },
				{
					headers: {
						authorization: `Bearer ${getState().userSlice?.token}`,
					},
				}
			);

			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const fetchRandomUser = createAsyncThunk(
	"fetch/randomUsers",
	async (numberOfUser, { rejectWithValue }) => {
		try {
			const resp = await customFetch.post("/users/random-users", {
				numberOfUser,
			});

			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

const initialState = {
	user: null,
	token: getUserFromLocalStorage(),
	randomUsers: [],
};
const userSlice = createSlice({
	name: "userSlice",
	initialState,
	reducers: {
		logOutUser: (state, action) => {
			state.user = null;
			removeUserFromLocalStorage(action.payload);
		},
		setUserState: (state, action) => {
			state.user = action.payload;
		},
	},
	extraReducers: {
		[loginUser.pending]: (state) => {
			state.isLoading = true;
		},
		[loginUser.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			state.user = payload.user;
			state.status = payload.status;
			addUserToLocalStorage(payload.token);
			toast.success(payload.message);
		},
		[loginUser.rejected]: (state, { payload }) => {
			state.isLoading = false;
			toast.error(payload.message);
		},
		[loginUserWithToken.pending]: (state) => {
			state.isLoading = true;
		},
		[loginUserWithToken.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			state.user = payload.user;
			state.appErr = undefined;
			state.serverErr = undefined;
			toast.success("login successfull");
		},
		[loginUserWithToken.rejected]: (state, action) => {
			state.isLoading = false;
			state.appErr = action?.payload?.error;
			state.serverErr = action?.error?.message;
			toast.error(state.appErr);
		},
		[RegisterUser.pending]: (state) => {
			state.isLoading = true;
		},
		[RegisterUser.fulfilled]: (state, { payload }) => {
			state.isLoading = false;

			addUserToLocalStorage(payload);
			state.appErr = undefined;
			state.serverErr = undefined;
			toast("registered successfully");
		},
		[RegisterUser.rejected]: (state, action) => {
			state.isLoading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			state?.appErr ? toast(state?.appErr) : toast(state?.serverErr);
		},
		[updateUser.pending]: (state) => {
			state.isLoading = true;
		},
		[updateUser.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
			state.user = payload.user;
			toast.success(payload.message);
		},
		[updateUser.rejected]: (state, { payload }) => {
			state.isLoading = false;
			toast.error(payload.message);
		},
		[followOrUnfollowUser.pending]: (state) => {
			state.isLoading = true;
		},
		[followOrUnfollowUser.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
			state.user = action.payload.user;
			toast.success(action.payload?.message);
		},
		[followOrUnfollowUser.rejected]: (state, action) => {
			state.isLoading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			state?.appErr
				? toast.warn(state?.appErr)
				: toast.error(state?.serverErr);
		},
		[savePost.pending]: (state) => {
			state.isLoading = true;
		},
		[savePost.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			state.user.savedPost = payload.savedPost;
			toast.success(payload?.message);
		},
		[savePost.rejected]: (state, action) => {
			state.isLoading = false;

			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			toast.error(action?.payload?.message);
		},
		[fetchRandomUser.pending]: (state) => {
			state.isLoading = true;
		},
		[fetchRandomUser.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			state.randomUsers = payload.users;
			toast.success(payload?.message);
		},
		[fetchRandomUser.rejected]: (state, action) => {
			state.isLoading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			toast.error(action?.payload?.message);
		},
	},
});

export default userSlice.reducer;
export const { logOutUser, setUserState } = userSlice.actions;
