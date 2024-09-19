import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name:"user",
    initialState: {
        email: "",
        pending: false,
        provinsi: "DKI Jakarta",
        kabupaten: "Jakarta Timur",
        kecamatan: "Penggilingan",
        kategori: "all"
    },
    reducers: {
        update: (state, action) => {
            state.email = action.payload.email,
            state.pending = action.payload.pending,
            state.provinsi = action.payload.provinsi
            state.kabupaten = action.payload.kabupaten
            state.kecamatan = action.payload.kecamatan
            state.kategori = action.payload.kategori
        }
    }
});

export const {update} = userSlice.actions
export default userSlice.reducer