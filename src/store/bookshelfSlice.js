import { createSlice } from "@reduxjs/toolkit";

const loadBookshelfFromStorage = () => {
  try {
    const saved = localStorage.getItem("bookshelfItems");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Error loading bookshelf from storage", e);
    return [];
  }
};

const bookshelfSlice = createSlice({
  name: "bookshelf",
  initialState: {
    bookshelfItems: loadBookshelfFromStorage(),
  },
  reducers: {
    addToBookshelf: (state, action) => {
      const book = action.payload;
      const exists = state.bookshelfItems.some((item) => item.id === book.id);
      if (!exists) {
        state.bookshelfItems.push(book);
        localStorage.setItem("bookshelfItems", JSON.stringify(state.bookshelfItems));
      }
    },
    removeFromBookshelf: (state, action) => {
      const bookId = action.payload;
      state.bookshelfItems = state.bookshelfItems.filter((item) => item.id !== bookId);
      localStorage.setItem("bookshelfItems", JSON.stringify(state.bookshelfItems));
    },
    clearBookshelf: (state) => {
      state.bookshelfItems = [];
      localStorage.removeItem("bookshelfItems");
    },
    setBookshelfItems: (state, action) => {
      state.bookshelfItems = action.payload;
      localStorage.setItem("bookshelfItems", JSON.stringify(state.bookshelfItems));
    },
  },
});

export const { addToBookshelf, removeFromBookshelf, clearBookshelf, setBookshelfItems } = bookshelfSlice.actions;
export default bookshelfSlice.reducer;
