import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "@/types/type";

export const initialState = {
  email: "satra.shufi46@smk.belajar.id",
  pending: false,
  user_id: 9,
  nama: "Satra Shufi Aliyu",
  provinsi: "DKI Jakarta",
  kabupaten: "Jakarta Timur",
  kecamatan: "Penggilingan",
  kategori: "",
  disabledLoc: false,
  fileUpload: [],
}

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    update: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload)
    },
  },
});

export const { update } = userSlice.actions;
export default userSlice.reducer;
