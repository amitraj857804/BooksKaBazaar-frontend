import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import bookshelfReducer from "./bookshelfSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    bookshelf: bookshelfReducer,
  },
});

export default store;
