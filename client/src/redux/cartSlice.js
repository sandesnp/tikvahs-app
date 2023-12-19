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

      state.totalAmount += Number(newItem.price * newItem.quantity);
    },
    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item._id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter((item) => item._id !== id);
      }
    },
    updateQuantity: (state, action) => {
      console.log(action.payload);
      const { id, operation } = action.payload;
      const existingItem = state.items.find((item) => item._id === id);

      if (existingItem) {
        let quantityChange = 1;

        if (operation === 'decrement') {
          quantityChange = -1;
        }

        existingItem.quantity += quantityChange;

        // Update the total quantity of items in the cart
        state.totalQuantity += quantityChange;
        // Update the total amount of the cart
        state.totalAmount += existingItem.price * quantityChange;
        state.totalAmount = Math.round(state.totalAmount * 100) / 100;
        // When the quantity is zero, remove the item from the cart
        if (existingItem.quantity === 0) {
          state.items = state.items.filter((item) => item._id !== id);
        }
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
