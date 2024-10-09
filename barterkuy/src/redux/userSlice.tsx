import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    email: "",
    pending: false,
    user_id: 9,
    nama: "Satra Shufi Aliyu",
    provinsi: "DKI Jakarta",
    kabupaten: "Jakarta Timur",
    kecamatan: "Penggilingan",
    kategori: "",
    disabledLoc: false,
    fileUpload: [],
  },
  reducers: {
    update: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { update } = userSlice.actions;
export default userSlice.reducer;
