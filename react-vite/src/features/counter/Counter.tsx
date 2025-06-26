import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { increment, decrement } from './counterSlice';

const Counter: React.FC = () => {
    // Use the typed hooks instead of regular useSelector and useDispatch
    const count = useAppSelector((state) => state.counter.value);
    const dispatch = useAppDispatch();

    return (
        <div className="flex flex-col items-center space-y-4 p-6">
            <h2 className="text-2xl font-bold">Counter: {count}</h2>
            <div className="flex space-x-4">
                <button
                    onClick={() => dispatch(increment())}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Increment
                </button>
                <button
                    onClick={() => dispatch(decrement())}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Decrement
                </button>
            </div>
        </div>
    );
};

export default Counter;