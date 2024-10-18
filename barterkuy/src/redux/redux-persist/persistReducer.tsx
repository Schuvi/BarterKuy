import { combineReducers } from "redux";
import userReducer from "../userSlice";
import thingsReducer from "../thingsSlice";

const persistRootReducer = combineReducers({
  user: userReducer,
  things: thingsReducer
});

const reducerRootPersist = (state: ReturnType<typeof persistRootReducer> | undefined, action: any) => {
    if (action.type === "RESET") {
        state = undefined
    }

    return persistRootReducer(state, action)
}

export type RootPersist = ReturnType<typeof persistRootReducer>;
export default reducerRootPersist;