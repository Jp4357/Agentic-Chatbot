import { createSlice, } from "@reduxjs/toolkit";

// Define the shape of the slice state
interface CounterState {
    value: number;
}

// Initial state with proper type
const initialState: CounterState = {
    value: 0,
};

export const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },

    },
});

// Export actions
export const { increment, decrement } = counterSlice.actions;

// Export reducer
export default counterSlice.reducer;