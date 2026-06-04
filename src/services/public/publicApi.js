import axiosInstance from "../axios/axiosInstance";

export const publicApi = {
  getAllBooks: async () => {
    try {
      const response = await axiosInstance.get("/public/books/all");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default publicApi;
