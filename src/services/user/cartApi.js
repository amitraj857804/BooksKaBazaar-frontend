import axiosInstance from "../axios/axiosInstance";

export const cartApi = {
  get: async () => {
    try {
      const response = await axiosInstance.get("/auth/user/cart");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  add: async (bookId, quantity = 1) => {
    try {
      const response = await axiosInstance.post("/auth/user/cart/add", {
        bookId: parseInt(bookId, 10),
        quantity: parseInt(quantity, 10),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (cartItemId, quantity) => {
    try {
      const response = await axiosInstance.put(`/auth/user/cart/update/${cartItemId}`, {
        quantity: parseInt(quantity, 10),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  remove: async (cartItemId) => {
    try {
      const response = await axiosInstance.delete(`/auth/user/cart/remove/${cartItemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  clear: async () => {
    try {
      const response = await axiosInstance.delete("/auth/user/cart/clear");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default cartApi;
