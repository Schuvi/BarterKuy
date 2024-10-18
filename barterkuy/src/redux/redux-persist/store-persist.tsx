import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import reducerRootPersist, {RootPersist} from "./persistReducer";
import userTransform from "./userPersistConfig";

const persistConfig = {
    key: "root",
    storage,
    transforms: [userTransform],
    whitelist: ["user"]
}

const persistedReducer = persistReducer(persistConfig, reducerRootPersist)

const persistedStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
})

const persistor = persistStore(persistedStore)

export {persistedStore, persistor}

export type AppDispatch = typeof persistedStore.dispatch
export type {RootPersist}
export type RootStatePersist = ReturnType<typeof persistedStore.getState>