import axiosInstance from "../axios/axiosInstance";

export const wishlistApi = {
  add: async (bookId) => {
    try {
      const response = await axiosInstance.post("/auth/user/wishlist/add", {
        bookId: parseInt(bookId, 10),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  remove: async (bookId) => {
    try {
      const response = await axiosInstance.delete(`/auth/user/wishlist/remove/${parseInt(bookId, 10)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  get: async () => {
    try {
      const response = await axiosInstance.get("/auth/user/wishlist");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default wishlistApi;
