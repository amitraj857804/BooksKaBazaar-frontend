// Superadmin API Service
import mockApiResponses from './mockApiResponses';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Toggle between mock and real API
// Set to true to use mock API (for testing without backend)
// Set to false to use real backend
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || true;

// Log API mode on startup
if (typeof window !== 'undefined') {
  console.log(`🔧 API Mode: ${USE_MOCK_API ? '🎭 MOCK API (Testing)' : '🌐 Real Backend'}`);
}

export const superAdminApi = {
  // Auth APIs
  login: async (username, password) => {
    try {
      if (USE_MOCK_API) {
        console.log('📱 Mock API: login');
        return await mockApiResponses.login(username, password);
      }

      const response = await fetch(`${API_BASE_URL}/auth/superadmin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Ebook APIs
  uploadEbook: async (ebookData, token) => {
    try {
      if (USE_MOCK_API) {
        console.log('📱 Mock API: uploadEbook');
        return await mockApiResponses.uploadEbook(ebookData);
      }

      const response = await fetch(`${API_BASE_URL}/auth/superadmin/upload-ebook`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ebookData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Ebook upload failed');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Exam APIs
  createExam: async (examData, token) => {
    try {
      if (USE_MOCK_API) {
        console.log('📱 Mock API: createExam');
        return await mockApiResponses.createExam(examData);
      }

      const response = await fetch(`${API_BASE_URL}/auth/superadmin/create-exam`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Exam creation failed');
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateExam: async (examId, examData, token) => {
    try {
      if (USE_MOCK_API) {
        console.log('📱 Mock API: updateExam');
        return await mockApiResponses.updateExam(examId, examData);
      }

      const response = await fetch(`${API_BASE_URL}/auth/superadmin/update-exam/${examId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Exam update failed');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Offer APIs
  createOffer: async (offerData, token) => {
    try {
      if (USE_MOCK_API) {
        console.log('📱 Mock API: createOffer');
        return await mockApiResponses.createOffer(offerData);
      }

      const response = await fetch(`${API_BASE_URL}/auth/superadmin/manage-offers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Offer creation failed');
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateOffer: async (offerId, offerData, token) => {
    try {
      if (USE_MOCK_API) {
        console.log('📱 Mock API: updateOffer');
        return await mockApiResponses.updateOffer(offerId, offerData);
      }

      const response = await fetch(`${API_BASE_URL}/auth/superadmin/update-offer/${offerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Offer update failed');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Bestseller APIs
  createBestseller: async (bestsellerData, token) => {
    try {
      if (USE_MOCK_API) {
        console.log('📱 Mock API: createBestseller');
        return await mockApiResponses.createBestseller(bestsellerData);
      }

      const response = await fetch(`${API_BASE_URL}/auth/superadmin/manage-bestseller`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bestsellerData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Bestseller creation failed');
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateBestseller: async (bestsellerId, bestsellerData, token) => {
    try {
      if (USE_MOCK_API) {
        console.log('📱 Mock API: updateBestseller');
        return await mockApiResponses.updateBestseller(bestsellerId, bestsellerData);
      }

      const response = await fetch(`${API_BASE_URL}/auth/superadmin/update-bestseller/${bestsellerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bestsellerData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Bestseller update failed');
      return data;
    } catch (error) {
      throw error;
    }
  },
};
