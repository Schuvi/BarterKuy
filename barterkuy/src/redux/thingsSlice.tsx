import { createSlice } from "@reduxjs/toolkit";

export const thingsSlice = createSlice({
  name: "things",
  initialState: {
    provinceThings: "",
    kabupatenThings: "",
    triggerSearch: false
  },
  reducers: {
    updateThings: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateThings } = thingsSlice.actions;
export default thingsSlice.reducer;
