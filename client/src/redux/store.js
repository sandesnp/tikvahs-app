import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    User: userReducer,
  },
  devTools: true,
});

export default store;
