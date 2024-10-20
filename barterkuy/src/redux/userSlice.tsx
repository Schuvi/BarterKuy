import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "@/types/type";

export const initialState = {
  email: "",
  pending: false,
  user_id: 0,
  nama: "",
  provinsi: "",
  kabupaten: "",
  kecamatan: "",
  kategori: "",
  disabledLoc: false,
  fileUpload: [],
  token: "",
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
