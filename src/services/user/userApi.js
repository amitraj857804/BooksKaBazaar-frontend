import axiosInstance from "../axios/axiosInstance";

export const userApi = {
  register: async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/user/register", {
        fullName: userData.fullName,
        emailId: userData.emailId,
        phoneNumber: userData.phoneNumber,
        password: userData.password,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        pincode: userData.pincode,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (identifier, password) => {
    try {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      const response = await axiosInstance.post("/auth/user/login", {
        email: isEmail ? identifier : "",
        phone: !isEmail ? identifier : "",
        password: password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (identifier) => {
    try {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      const response = await axiosInstance.post("/auth/user/forgot-password", {
        email: isEmail ? identifier : "",
        phone: !isEmail ? identifier : "",
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await axiosInstance.get("/auth/user/profile");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put("/auth/user/profile", profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAddresses: async () => {
    try {
      const response = await axiosInstance.get("/auth/user/addresses");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createAddress: async (addressData) => {
    try {
      const response = await axiosInstance.post("/auth/user/addresses", addressData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteAddress: async (addressId) => {
    try {
      const response = await axiosInstance.delete(`/auth/user/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAddress: async (addressId, addressData) => {
    try {
      const response = await axiosInstance.put(`/auth/user/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  setDefaultAddress: async (addressId) => {
    try {
      const response = await axiosInstance.patch(`/auth/user/addresses/${addressId}/set-default`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  submitReview: async (bookId, rating, reviewText) => {
    try {
      const response = await axiosInstance.post(`auth/user/books/${bookId}/reviews`, {
        rating: String(rating),
        reviewText: reviewText,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getReviews: async (bookId) => {
    try {
      const response = await axiosInstance.get(`/auth/user/books/${bookId}/reviews`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateReview: async (reviewId, rating, reviewText) => {
    try {
      const response = await axiosInstance.put(`/auth/user/reviews/${reviewId}`, {
        rating: String(rating),
        reviewText: reviewText,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userApi;

