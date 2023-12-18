import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    User: userReducer,
    Cart: cartReducer,
  },

  devTools: true,
});

export default store;
