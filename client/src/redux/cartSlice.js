// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array of products in the cart
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item._id === newItem._id);
      state.totalQuantity += newItem.quantity;
      if (!existingItem) {
        state.items.push({ ...newItem });
      } else {
        existingItem.quantity += newItem.quantity;
      }

      state.totalAmount += Number(newItem.price);
    },
    // Add other reducers as needed (e.g., removeItem, clearCart)
  },
});

export const { addItem } = cartSlice.actions;
export default cartSlice.reducer;
