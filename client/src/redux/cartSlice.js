// cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const checkoutCart = createAsyncThunk(
  'cart/checkout',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const items = state.Cart.items.map((item) => ({
      id: item._id,
      quantity: item.quantity,
    }));
    try {
      const response = await axios.post('/api/order/create-checkout-session', {
        items,
      });
      if (response.data.success) {
        dispatch(clearCart()); // Clear the cart if checkout is successful
      }
      return response.data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  }
);

const initialState = {
  items: [], // Array of products in the cart
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
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

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
