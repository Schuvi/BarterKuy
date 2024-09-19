import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name:"user",
    initialState: {
        email: "",
        pending: false,
        provinsi: "DKI Jakarta",
        kabupaten: "Jakarta Timur",
        kecamatan: "Penggilingan",
        kategori: "",
        id_barang: "",
    },
    reducers: {
        update: (state, action) => {
            return {
                ...state,
                ...action.payload
            }
        }
    }
});

export const {update} = userSlice.actions
export default userSlice.reducer