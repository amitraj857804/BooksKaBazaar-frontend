import axiosInstance from "../axios/axiosInstance";

// Admin API Service using centralized axios instance
export const adminApi = {
  // Auth APIs
  register: async (registrationData) => {
    try {
      const response = await axiosInstance.post("/auth/admin/register", {
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
      const response = await axiosInstance.post(
        "/auth/admin/resend-verification",
        {
          email,
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (phone, password) => {
    try {
      const response = await axiosInstance.post("/auth/admin/login", {
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
      const response = await axiosInstance.post("/auth/admin/login", {
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
      const response = await axiosInstance.post(
        "/auth/admin/resend-verification",
        {
          email,
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (data) => {
    try {
      const response = await axiosInstance.post(
        "/auth/admin/forgot-password",
        data,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Dashboard APIs
  getInventoryStats: async () => {
    try {
      const response = await axiosInstance.get(
        "/admin/dashboard/inventory-stats",
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLowStockAlerts: async () => {
    try {
      const response = await axiosInstance.get(
        "/admin/dashboard/low-stock-alerts",
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Inventory/Book APIs
  createBook: async (bookData, image) => {
    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }
      
      const createRequest = {
        bookTitle: bookData.title,
        authorName: bookData.author,
        isbn: bookData.isbn,
        description: bookData.description,
        category: bookData.category,
        publisher: bookData.publisher || "",
        publicationYear: bookData.publicationYear || new Date().getFullYear(),
        price: bookData.price,
        costPrice: bookData.costPrice || bookData.price * 0.7,
        initialStock: bookData.stock
      };

      formData.append("book", new Blob([JSON.stringify(createRequest)], { type: 'application/json' }));

      const response = await axiosInstance.post(
        "/admin/inventory/books",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateBook: async (bookId, bookData, image) => {
    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }

      const updateRequest = {
        bookId: bookId,
        bookTitle: bookData.title,
        authorName: bookData.author,
        description: bookData.description || "",
        category: bookData.category || "Fiction",
        publisher: bookData.publisher || "",
        price: bookData.price,
        costPrice: bookData.costPrice || (bookData.price ? bookData.price * 0.7 : 0)
      };

      formData.append("book", new Blob([JSON.stringify(updateRequest)], { type: 'application/json' }));

      const response = await axiosInstance.put(
        `/admin/inventory/books/${bookId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBooks: async () => {
    try {
      const response = await axiosInstance.get("/admin/inventory/books");
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

  deleteBook: async (bookId) => {
    try {
      const response = await axiosInstance.delete(`/admin/inventory/books/${bookId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchBooks: async (query) => {
    try {
      const response = await axiosInstance.get("/admin/inventory/books/search", {
        params: { query }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateStock: async (stockData) => {
    try {
      const response = await axiosInstance.post("/admin/inventory/stock/update", stockData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStockHistory: async (bookId) => {
    try {
      const response = await axiosInstance.get(`/admin/inventory/books/${bookId}/stock-history`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLowStockBooks: async () => {
    try {
      const response = await axiosInstance.get("/admin/inventory/low-stock");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getOutOfStockBooks: async () => {
    try {
      const response = await axiosInstance.get("/admin/inventory/out-of-stock");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default adminApi;
