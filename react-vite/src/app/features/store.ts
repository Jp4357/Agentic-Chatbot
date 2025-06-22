import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { productsApi } from "../dummyData/dummyData";
import counterSlice from "./counter/counterSlice";

export const store = configureStore({
    reducer: {
        [productsApi.reducerPath]: productsApi.reducer,
        counter: counterSlice, // Add the counter reducer here
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(productsApi.middleware),
});

// Optional: For refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// Inferred types for app-wide usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;