import { toast } from "react-toastify";
import customFetch from "../../utils/axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllCategorys = createAsyncThunk(
	"fetch/AllCategories",
	async (_, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch("/categorys");
			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error(error);
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const initialState = {
	allCategory: [],
	status: "idle",
};

const categorySlice = createSlice({
	name: "categorySlice",
	initialState,

	extraReducers: {
		[fetchAllCategorys.pending]: (state, { payload }) => {
			state.status = "loading";
		},
		[fetchAllCategorys.fulfilled]: (state, { payload }) => {
			state.status = "success";
			state.allCategory = payload.allCategory;
			console.log(state.allCategory);
		},
		[fetchAllCategorys.rejected]: (state, { payload }) => {
			state.status = "failed";
			toast.error(payload.message);
		},
	},
});

export default categorySlice.reducer;
