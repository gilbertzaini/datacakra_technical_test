import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import articlesReducer from "./features/articleSlice";

// Redux Persist Configuration
const persistConfig = {
  key: "root", // Key for storing state
  storage, // Use localStorage (change to sessionStorage if needed)
};

// Wrap articles reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, articlesReducer);

export const store = configureStore({
  reducer: {
    articles: persistedReducer, // Use the persisted reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents serialization errors
    }),
});

// Create Persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
