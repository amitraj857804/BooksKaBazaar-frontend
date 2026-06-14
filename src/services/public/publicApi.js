import axiosInstance from "../axios/axiosInstance";

export const publicApi = {
  getAllBooks: async () => {
    try {
      const response = await axiosInstance.get("/public/books");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getBestsellers: async () => {
    try {
      const response = await axiosInstance.get("/public/books/bestsellers");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getNewArrivals: async () => {
    try {
      const response = await axiosInstance.get("/public/books/new-arrivals");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getBookById: async (bookId) => {
    try {
      const response = await axiosInstance.get(`/public/books/${bookId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  searchBooks: async (query) => {
    try {
      const response = await axiosInstance.get(`/public/books/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default publicApi;
