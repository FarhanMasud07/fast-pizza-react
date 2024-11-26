import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      state.cart = state.cart.filter((item) => item !== action.payload);
    },
    increaseItemQuantity(state, action) {
      const item = state.cart.find((c) => c === action.payload);
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuantity(state, action) {
      const item = state.cart.find((c) => c === action.payload);
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    clearItem(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearItem,
} = cartSlice.actions;

export default cartSlice.reducer;

export const getCart = (state) => state && state.cart.cart;

export const getTotalCartQuantity = (state) =>
  state && state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (state) =>
  state && state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

// reselect
