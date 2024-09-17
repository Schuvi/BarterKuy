import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name:"user",
    initialState: {
        email: "",
        pending: false
    },
    reducers: {
        update: (state, action) => {
            state.email = action.payload.email,
            state.pending = action.payload.pending
        }
    }
});

export const {update} = userSlice.actions
export default userSlice.reducer