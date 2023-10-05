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
			console.log("im here");
			console.log(payload);
			state.isLoading = false;
			state.user = payload.user;
			state.status = payload.status;
			addUserToLocalStorage(payload.token);
			state.appErr = undefined;
			state.serverErr = undefined;
			toast.success("login successfull");
		},
		[loginUser.rejected]: (state, action) => {
			state.isLoading = false;

			state.status = action.payload.status;
			state.appErr = action?.payload?.error;
			state.serverErr = action?.error?.message;
			toast(state.appErr);
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
			console.log(payload);
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
			toast("profile updated successfully");
		},
		[updateUser.rejected]: (state, action) => {
			state.isLoading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			state?.appErr ? toast(state?.appErr) : toast(state?.serverErr);
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
	},
});

export default userSlice.reducer;
export const { logOutUser, setUserState } = userSlice.actions;
