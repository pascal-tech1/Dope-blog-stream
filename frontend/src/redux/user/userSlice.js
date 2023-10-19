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

		const action = isfollowing ? "unfollow" : "follow";

		try {
			const resp = await customFetch.post(
				`users/${action}`,
				{ userToFollowOrUnfollowId },
				{
					headers: {
						authorization: `Bearer ${getState().userSlice?.token}`,
					},
				}
			);

			return { data: resp.data, action };
		} catch (error) {
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

export const fetchUserFollowingList = createAsyncThunk(
	"user/followingList",
	async (user, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch.post("/users/following", user);

			return resp.data;
		} catch (error) {
			console.log(error);
			if (!error.response) {
				throw new Error();
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const fetchUserFollowersList = createAsyncThunk(
	"user/followersList",
	async (user, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch.post("/users/followers", user);

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
	user: null,
	token: getUserFromLocalStorage(),
	randomUsers: [],
	userfollowinglist: [],
	followinglistTotalNumber: 0,
	userFollowerslist: [],
	followerslistTotalNumber: 0,
	fetchingFollowersListStatus: "idle",
	fetchingFollowingListStatus: "idle",
};
const userSlice = createSlice({
	name: "userSlice",
	initialState,
	reducers: {
		logOutUser: (state, action) => {
			state.user = null;
			state.token = getUserFromLocalStorage();
			state.randomUsers = [];
			state.userfollowinglist = [];
			state.followinglistTotalNumber = 0;
			state.userFollowerslist = [];
			state.followerslistTotalNumber = 0;
			state.fetchingFollowersListStatus = "idle";
			(state.fetchingFollowingListStatus = "idle"),
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
			state.follwoingIsLoading = true;
		},
		[followOrUnfollowUser.fulfilled]: (state, { payload }) => {
			state.follwoingIsLoading = false;
			state.user = payload.data.user;

			toast.success(payload.data.message);

			if (payload.action === "unfollow") {
				state.userfollowinglist = state.userfollowinglist.filter(
					(user) => user._id !== payload.data.userToUnFollowId
				);
				state.followinglistTotalNumber -= 1;
			}
			if (payload.action === "follow") {
				state.userfollowinglist = [
					payload.data.userToFollow,
					...state.userfollowinglist,
				];
				state.followinglistTotalNumber += 1;
			}
		},
		[followOrUnfollowUser.rejected]: (state, action) => {
			state.follwoingIsLoading = false;
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
		[fetchUserFollowingList.pending]: (state) => {
			state.fetchingFollowingListStatus = "loading";
		},
		[fetchUserFollowingList.fulfilled]: (state, { payload }) => {
			state.fetchingFollowingListStatus = "success";
			state.userfollowinglist = payload.userfollowinglist;
			state.followinglistTotalNumber = payload.followinglistTotalNumber;
		},
		[fetchUserFollowingList.rejected]: (state, action) => {
			state.fetchingFollowingListStatus = "failed";
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			toast.error(action?.payload?.message);
		},
		[fetchUserFollowersList.pending]: (state) => {
			state.fetchingFollowersListStatus = "loading";
		},
		[fetchUserFollowersList.fulfilled]: (state, { payload }) => {
			state.fetchingFollowersListStatus = "success";
			console.log(payload.userfollowerlist);
			state.userFollowerslist = payload.userfollowerlist;
			state.followerslistTotalNumber = payload.followerslistTotalNumber;
		},
		[fetchUserFollowersList.rejected]: (state, action) => {
			state.fetchingFollowersListStatus = "failed";
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			toast.error(action?.payload?.message);
		},
	},
});

export default userSlice.reducer;
export const { logOutUser, setUserState } = userSlice.actions;
