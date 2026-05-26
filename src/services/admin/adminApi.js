import axiosInstance from '../axios/axiosInstance';

// Admin API Service using centralized axios instance
export const adminApi = {
  // Auth APIs
  register: async (registrationData) => {
    try {
      const response = await axiosInstance.post('/auth/admin/register', {
        sellerName: registrationData.sellerName,
        emailId: registrationData.emailId,
        phoneNumber: registrationData.phoneNumber,
        password: registrationData.password,
        gstNo: registrationData.gstNo,
        companyName: registrationData.companyName,
        sellingOldBooks: registrationData.sellingOldBooks,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resendVerificationEmail: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/admin/resend-verification', {
        email: email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (phone, password) => {
    try {
      const response = await axiosInstance.post('/auth/admin/login', {
        phone,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  loginWithEmail: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/admin/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resendVerification: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/admin/resend-verification', {
        email: email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Dashboard APIs
  getInventoryStats: async () => {
    try {
      const response = await axiosInstance.get('/admin/dashboard/inventory-stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLowStockAlerts: async () => {
    try {
      const response = await axiosInstance.get('/admin/dashboard/low-stock-alerts');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Inventory/Book APIs
  createBook: async (bookData, image) => {
    try {
      const formData = new FormData();
      
      // Append image file
      if (image) {
        formData.append('image', image);
      }
      
      // Append book data as JSON string
      formData.append('book', JSON.stringify(bookData));
      
      const response = await axiosInstance.post('/admin/inventory/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBooks: async () => {
    try {
      const response = await axiosInstance.get('/admin/inventory/books');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateBook: async (bookId, bookData) => {
    try {
      const response = await axiosInstance.put(`/admin/inventory/books/${bookId}`, bookData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteBook: async (bookId) => {
    try {
      const response = await axiosInstance.delete(`/admin/inventory/books/${bookId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBookById: async (bookId) => {
    try {
      const response = await axiosInstance.get(`/admin/inventory/books/${bookId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default adminApi;
