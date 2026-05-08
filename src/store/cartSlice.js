import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item or increase quantity if it already exists
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === newItem.id);

      if (existingItem) {
        // Item already in cart, increase quantity
        existingItem.quantity += 1;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        // New item to cart
        state.cartItems.push({
          ...newItem,
          quantity: 1,
          totalPrice: newItem.price,
        });
      }

      // Recalculate totals
      state.totalQuantity += 1;
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
    },

    // Remove item from cart
    removeItem: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === itemId);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.totalPrice;
        state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
      }
    },

    // Update quantity of an item
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === itemId);

      if (existingItem) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.totalQuantity -= existingItem.quantity;
          state.totalAmount -= existingItem.totalPrice;
          state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
        } else {
          // Update quantity
          const quantityDifference = quantity - existingItem.quantity;
          existingItem.quantity = quantity;
          existingItem.totalPrice = quantity * existingItem.price;
          state.totalQuantity += quantityDifference;
          state.totalAmount = state.cartItems.reduce(
            (total, item) => total + item.totalPrice,
            0
          );
        }
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
