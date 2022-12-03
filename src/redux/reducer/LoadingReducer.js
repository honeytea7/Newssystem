import { createSlice } from "@reduxjs/toolkit";
const loadingSlice = createSlice({
  name: "loading",
  initialState: { loading: false },
  reducers: {
    setLoading(state, action) {
      state.loading = !state.loading;
    },
  },
});
export const { setLoading } = loadingSlice.actions;
export const { reducer: loadingdReducer } = loadingSlice;
 