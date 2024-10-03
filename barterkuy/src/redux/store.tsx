import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import thingsReducer from "./thingsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    things: thingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
