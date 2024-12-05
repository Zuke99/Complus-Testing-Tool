import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/AuthSlice';
import dataReducer from './features/dbSlice';
import treeReducer from './features/CounterSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    dbData: dataReducer,
    treeData: treeReducer
  },
});

export default store;
