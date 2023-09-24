import customFetch from "../../utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import {
	addUserToLocalStorage,
	getUserFromLocalStorage,
	removeUserFromLocalStorage,
} from "../../utils/localStorage";

const initialState = {
	user: getUserFromLocalStorage(),
};

export const loginUser = createAsyncThunk(
	"user/loginUser",
	async (user, { rejectWithValue, getState, dispatch }) => {
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
					authorization: `Bearer ${getState().userSlice?.user?.token}`,
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

const userSlice = createSlice({
	name: "userSlice",
	initialState,
	reducers: {
		logOutUser: (state, action) => {
			(state.user = null), removeUserFromLocalStorage(action.payload);
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
			state.user = payload;
			addUserToLocalStorage(payload);
			state.appErr = undefined;
			state.serverErr = undefined;
			toast("login successfull");
		},
		[loginUser.rejected]: (state, action) => {
			state.isLoading = false;

			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			toast(state.appErr);
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

			const user = getUserFromLocalStorage("user");
			user.user = payload;
			state.user = user;
			addUserToLocalStorage(user);

			toast("profile updated successfully");
		},
		[updateUser.rejected]: (state, action) => {
			state.isLoading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			state?.appErr ? toast(state?.appErr) : toast(state?.serverErr);
		},
	},
});

export default userSlice.reducer;
export const { logOutUser, setUserState } = userSlice.actions;
