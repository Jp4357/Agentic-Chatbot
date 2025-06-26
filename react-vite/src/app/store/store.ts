import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { productsApi } from "../../services/api/dummyData/dummyData";
import counterSlice from "../../features/counter/counterSlice";

export const store = configureStore({
    reducer: {
        [productsApi.reducerPath]: productsApi.reducer,
        counter: counterSlice, // Add the counter reducer here
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(productsApi.middleware),
});


//sampole request model python
// ChatRequest(BaseModel):
//     message: str
//     api_key: str
//     history: Optional[List[ChatMessage]] = []

// Optional: For refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// Inferred types for app-wide usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;