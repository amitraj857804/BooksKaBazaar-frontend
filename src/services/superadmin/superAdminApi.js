// Superadmin API Service using centralized axios instance
import axiosInstance from '../axios/axiosInstance';

export const superAdminApi = {
  // Auth APIs
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post('/auth/superadmin/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Ebook APIs
  uploadEbook: async (ebookData) => {
    try {
      const response = await axiosInstance.post('/superadmin/upload-ebook', ebookData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Exam APIs
  createExam: async (examData) => {
    try {
      const response = await axiosInstance.post('/auth/superadmin/create-exam', examData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateExam: async (examId, examData) => {
    try {
      const response = await axiosInstance.put('/superadmin/create-exam', { 
        examId, 
        ...examData 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Offer APIs
  createOffer: async (offerData) => {
    try {
      const response = await axiosInstance.post('/superadmin/manage-offers', offerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateOffer: async (offerId, offerData) => {
    try {
      const response = await axiosInstance.post('/superadmin/manage-offers', { 
        offerId, 
        ...offerData 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Bestseller APIs
  createBestseller: async (bestsellerData) => {
    try {
      const response = await axiosInstance.post('/superadmin/manage-bestseller', bestsellerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateBestseller: async (bestsellerId, bestsellerData) => {
    try {
      const response = await axiosInstance.post('/superadmin/manage-bestseller', { 
        bestsellerId, 
        ...bestsellerData 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get APIs - for fetching data
  getExams: async () => {
    try {
      const response = await axiosInstance.get('/superadmin/exams');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getOffers: async () => {
    try {
      const response = await axiosInstance.get('/superadmin/offers');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEbooks: async () => {
    try {
      const response = await axiosInstance.get('/superadmin/ebooks');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBestsellers: async () => {
    try {
      const response = await axiosInstance.get('/superadmin/bestsellers');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete APIs
  deleteExam: async (examId) => {
    try {
      const response = await axiosInstance.delete(`/superadmin/exams/${examId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteOffer: async (offerId) => {
    try {
      const response = await axiosInstance.delete(`/superadmin/offers/${offerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteEbook: async (bookId) => {
    try {
      const response = await axiosInstance.delete(`/superadmin/ebooks/${bookId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteBestseller: async (bestsellerId) => {
    try {
      const response = await axiosInstance.delete(`/superadmin/bestsellers/${bestsellerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
