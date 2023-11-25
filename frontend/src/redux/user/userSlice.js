import customFetch from "../../utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import {
	addUserToLocalStorage,
	getUserFromLocalStorage,
	removeUserFromLocalStorage,
} from "../../utils/localStorage";
import { updateUserSavedPost } from "../post/morePostSlice";

export const loginUser = createAsyncThunk(
	"user/loginUser",
	async (user, { rejectWithValue }) => {
		try {
			const resp = await customFetch.post("/users/login", user);
			return resp.data;
		} catch (error) {
			console.log(error)
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
			console.log(resp.data.postToBeSaved);
			dispatch(updateUserSavedPost(resp.data.postToBeSaved));
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
	async (_, { getState, rejectWithValue }) => {
		const { followingListPageNumber, followsNumberPerPage, user } =
			getState().userSlice;

		try {
			const resp = await customFetch(
				`/users/following?userId=${user._id}&pageNumber=${followingListPageNumber}&numberPerPage=${followsNumberPerPage}`
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
export const fetchUserFollowersList = createAsyncThunk(
	"user/followersList",
	async (_, { getState, rejectWithValue }) => {
		const { followersListPageNumber, followsNumberPerPage, user } =
			getState().userSlice;

		try {
			const resp = await customFetch(
				`/users/followers?userId=${user._id}&pageNumber=${followersListPageNumber}&numberPerPage=${followsNumberPerPage}`
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

export const fetchUserDetailsCounts = createAsyncThunk(
	"fetchUser/DetailsCounts",
	async (_, { getState, rejectWithValue }) => {
		console.log(getState().userSlice?.token);
		try {
			const resp = await customFetch("/users/user-details-Count", {
				headers: {
					authorization: `Bearer ${getState().userSlice?.token}`,
				},
			});
			console.log(resp.data);
			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const fetchWhoViewedUserProfile = createAsyncThunk(
	"fetchWho/ViewedUserProfile",
	async (_, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch("/users/viewedBy", {
				headers: {
					authorization: `Bearer ${getState().userSlice?.token}`,
				},
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

export const fetchPostImpressionsCount = createAsyncThunk(
	"post/impressionCount",
	async (params, { getState, rejectWithValue }) => {
		const { chartSelectedFilter } = getState().userSlice;

		try {
			const resp = await customFetch(
				`/users/impression-Counts?page=${params.page}&numberPerPage=${params.numberPerPage}&filter=${chartSelectedFilter}`,
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
export const uploadProfilePhoto = createAsyncThunk(
	"uploadProfile/Photo",
	async (userImage, { getState, rejectWithValue }) => {
		console.log(userImage.file);
		try {
			const resp = await customFetch.post(
				`/users/profile-picture-upload`,
				{ image: userImage.file, whatUploading: userImage.whatUploading },
				{
					headers: {
						"Content-Type": "multipart/form-data",
						authorization: `Bearer ${getState().userSlice?.token}`,
					},
				}
			);
			console.log(resp.data);

			return resp.data;
		} catch (error) {
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const verifyEmail = createAsyncThunk(
	"verify/Email",
	async (emailParam, { getState, rejectWithValue }) => {
		const email = emailParam || getState().userSlice.userEmail;
		try {
			const resp = await customFetch.post(`/users/send-email`, {
				email,
			});
			console.log(resp.data);
			return resp.data;
		} catch (error) {
			console.log(error);
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const confirmSentEmail = createAsyncThunk(
	"confirm/sentEmail",
	async (token, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch.post(`/users/confirm-sent-email`, {
				token,
			});
			console.log(resp.data);
			return resp.data;
		} catch (error) {
			console.log(error);
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const sendForgotPasswordEmail = createAsyncThunk(
	"send/forgotPasswordEmail",
	async (email, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch.post(`/users/forget-password`, email);
			console.log(resp.data);
			return resp.data;
		} catch (error) {
			console.log(error);
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const resetPassword = createAsyncThunk(
	"reset/Password",
	async (user, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch.post(`/users/reset-password`, user);
			console.log(resp.data);
			return resp.data;
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
	user: null,
	token: getUserFromLocalStorage(),
	randomUsers: [],
	userfollowinglist: [],
	followinglistTotalNumber: 0,
	userFollowerslist: [],
	followerslistTotalNumber: 0,
	fetchingFollowersListStatus: "idle",
	fetchingFollowingListStatus: "idle",
	userDetailsCount: {},
	whoViewUserProfile: [],
	whoViewUserProfileStatus: "idle",
	chartSelectedFilter: "likes and dislikes",
	userPostImpression: null,
	followingListPageNumber: 1,
	followsNumberPerPage: 2,
	followersListPageNumber: 1,
	confirmSentEmailStatus: "idle",
	resetPasswordStatus: "idle",
};
const userSlice = createSlice({
	name: "userSlice",
	initialState,
	reducers: {
		logOutUser: (state, action) => {
			removeUserFromLocalStorage();
			state.user = null;
			state.token = null;
			state.randomUsers = [];
			state.userfollowinglist = [];
			state.followinglistTotalNumber = 0;
			state.userFollowerslist = [];
			state.followerslistTotalNumber = 0;
			state.fetchingFollowersListStatus = "idle";
			state.fetchingFollowingListStatus = "idle";
			state.userDetailsCount = {};
			state.whoViewUserProfile = [];
			state.whoViewUserProfileStatus = "idle";
			state.chartSelectedFilter = "likes and dislikes";
			state.userPostImpression = null;
		},
		setUserState: (state, action) => {
			state.user = action.payload;
		},
		updateFollowingListPageNumber: (state, action) => {
			state.followingListPageNumber += 1;
		},
		updateFollowersListPageNumber: (state, action) => {
			state.followersListPageNumber += 1;
		},
		setFirstFetchFollowingUser: (state, action) => {
			state.followinglistTotalNumber = 0;
			state.followingListPageNumber = 1;
			state.userfollowinglist = [];
		},
		setFirstFetchFollowersUser: (state, action) => {
			state.followerslistTotalNumber = 0;
			state.followersListPageNumber = 1;
			state.userFollowerslist = [];
		},
		setChartSelectedFilter: (state, { payload }) => {
			state.chartSelectedFilter = payload;
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
			state.token = payload.token;
			toast.success(payload.message);
		},
		[loginUser.rejected]: (state, { payload }) => {
			state.isLoading = false;
			const error = payload?.message || error?.message;
			toast.error(error);
		},
		[loginUserWithToken.pending]: (state) => {
			state.isLoading = true;
		},
		[loginUserWithToken.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			state.user = payload.user;
		},
		[loginUserWithToken.rejected]: (state, action) => {
			state.isLoading = false;
			toast.error("login failed");
		},
		[RegisterUser.pending]: (state) => {
			state.registerUserStatus = "loading";
		},
		[RegisterUser.fulfilled]: (state, { payload }) => {
			state.registerUserStatus = "success";
			state.userEmail = payload.userEmail;
			toast.success(payload?.message);
		},
		[RegisterUser.rejected]: (state, action) => {
			state.registerUserStatus = "failed";
			const error = action?.payload?.message || action?.error?.message;
			toast.error(error);
		},
		[updateUser.pending]: (state) => {
			state.isLoading = true;
		},
		[updateUser.fulfilled]: (state, { payload }) => {
			state.isLoading = false;

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
				state.numberOfUnFollowUser += 1;
			}
			if (payload.action === "follow") {
				state.userfollowinglist = [
					payload.data.userToFollow,
					...state.userfollowinglist,
				];
				state.followinglistTotalNumber += 1;
				state.numberOfFollowUser += 1;
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

			state.userfollowinglist = [
				...state.userfollowinglist,
				...payload.userfollowinglist.following,
			];
			state.followinglistTotalNumber = payload.followinglistTotalNumber;
		},
		[fetchUserFollowingList.rejected]: (state, action) => {
			state.fetchingFollowingListStatus = "failed";
			const error = action?.payload?.message || action?.error?.message;
			toast.error(error);
		},
		[fetchUserFollowersList.pending]: (state) => {
			state.fetchingFollowersListStatus = "loading";
		},
		[fetchUserFollowersList.fulfilled]: (state, { payload }) => {
			state.fetchingFollowersListStatus = "success";
			state.userFollowerslist = [
				...state.userFollowerslist,
				...payload.userfollowerlist.followers,
			];
			state.followerslistTotalNumber = payload.followerslistTotalNumber;
			console.log(state.userFollowerslist);
		},
		[fetchUserFollowersList.rejected]: (state, action) => {
			state.fetchingFollowersListStatus = "failed";
			const error = action?.payload?.message || action?.error?.message;
			toast.error(error);
		},
		[fetchUserDetailsCounts.pending]: (state) => {
			state.userDetailsCountStatus = "loading";
		},
		[fetchUserDetailsCounts.fulfilled]: (state, { payload }) => {
			console.log(payload);
			state.userDetailsCountStatus = "success";
			state.userDetailsCount = payload;
		},
		[fetchUserDetailsCounts.rejected]: (state, action) => {
			console.log(action.payload);
			state.userDetailsCountStatus = "failed";
			toast.error(action?.payload?.message);
		},
		[fetchWhoViewedUserProfile.pending]: (state) => {
			state.whoViewUserProfileStatus = "loading";
		},
		[fetchWhoViewedUserProfile.fulfilled]: (state, { payload }) => {
			state.whoViewUserProfileStatus = "success";
			state.whoViewUserProfile = payload.userWhoViewProfile;
		},
		[fetchWhoViewedUserProfile.rejected]: (state, action) => {
			state.whoViewUserProfileStatus = "failed";
			toast.error(action?.payload?.message);
		},
		[fetchPostImpressionsCount.pending]: (state) => {
			state.userPostImpressionStatus = "loading";
		},
		[fetchPostImpressionsCount.fulfilled]: (state, { payload }) => {
			state.userPostImpressionStatus = "success";
			state.userPostImpression = payload;
		},
		[fetchPostImpressionsCount.rejected]: (state, action) => {
			state.userPostImpressionStatus = "failed";
			toast.error(action?.payload?.message);
		},
		[uploadProfilePhoto.pending]: (state) => {
			state.profilePictureUploadStatus = "loading";
		},
		[uploadProfilePhoto.fulfilled]: (state, { payload }) => {
			if (payload.whatUploading === "profilePhoto") {
				state.user.profilePhoto = payload.userImage;
			}
			if (payload.whatUploading === "coverPhoto") {
				state.user.coverPhoto = payload.userImage;
			}

			toast.success(payload?.message);
			console.log(payload);
			state.profilePictureUploadStatus = "success";
		},
		[uploadProfilePhoto.rejected]: (state, action) => {
			state.profilePictureUploadStatus = "failed";
			toast.error(action?.payload?.message);
		},
		[verifyEmail.pending]: (state) => {
			state.verifyEmailStatus = "loading";
		},
		[verifyEmail.fulfilled]: (state, { payload }) => {
			toast.success(payload?.message);
			state.verifyEmailStatus = "success";
		},
		[verifyEmail.rejected]: (state, { payload }) => {
			state.verifyEmailStatus = "failed";
			toast.error(payload?.message);
		},
		[confirmSentEmail.pending]: (state) => {
			state.confirmSentEmailStatus = "loading";
		},
		[confirmSentEmail.fulfilled]: (state, { payload }) => {
			toast.success(payload?.message);
			state.confirmSentEmailStatus = "success";
		},
		[confirmSentEmail.rejected]: (state, { payload }) => {
			state.confirmSentEmailStatus = "failed";
			toast.error(payload?.message);
		},
		[sendForgotPasswordEmail.pending]: (state) => {
			state.sendForgotPasswordEmailStatus = "loading";
		},
		[sendForgotPasswordEmail.fulfilled]: (state, { payload }) => {
			toast.success(payload?.message);
			state.sendForgotPasswordEmailStatus = "success";
		},
		[sendForgotPasswordEmail.rejected]: (state, { payload }) => {
			state.sendForgotPasswordEmailStatus = "failed";
			toast.error(payload?.message);
		},
		[resetPassword.pending]: (state) => {
			state.resetPasswordStatus = "loading";
		},
		[resetPassword.fulfilled]: (state, { payload }) => {
			toast.success(payload?.message);
			state.resetPasswordStatus = "success";
		},
		[resetPassword.rejected]: (state, { payload }) => {
			state.resetPasswordStatus = "failed";
			toast.error(payload?.message);
		},
	},
});

export default userSlice.reducer;
export const {
	logOutUser,
	setUserState,
	setChartSelectedFilter,
	updateFollowingListPageNumber,
	updateFollowersListPageNumber,
	setFirstFetchFollowingUser,
	setFirstFetchFollowersUser,
} = userSlice.actions;
