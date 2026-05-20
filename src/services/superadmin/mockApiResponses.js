// Mock API Responses for testing without backend
// This file simulates backend responses for development

const mockDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

const mockApiResponses = {
  // Login - Returns JWT token
  login: async (username, password) => {
    await mockDelay(1000);
    
    if (username === 'admin' && password === 'password123') {
      return {
        success: true,
        message: 'Login successful',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTYxNjIzOTAyMn0.sflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      };
    }
    
    return {
      success: false,
      message: 'Invalid credentials',
      token: null,
    };
  },

  // Upload Ebook
  uploadEbook: async (ebookData) => {
    await mockDelay(1200);
    
    console.log('Mock: Uploading ebook', {
      bookTitle: ebookData.bookTitle,
      author: ebookData.author,
      fileName: ebookData.fileName,
      fileSizeKB: Math.round(ebookData.fileContent.length / 1024),
    });
    
    return {
      success: true,
      message: 'Ebook uploaded successfully',
      bookId: Math.floor(Math.random() * 10000),
      bookTitle: ebookData.bookTitle,
      author: ebookData.author,
    };
  },

  // Create Exam
  createExam: async (examData) => {
    await mockDelay(800);
    
    console.log('Mock: Creating exam', examData);
    
    return {
      success: true,
      message: 'Exam created successfully',
      examId: Math.floor(Math.random() * 10000),
      examName: examData.examName,
      examDate: examData.examDate,
    };
  },

  // Update Exam
  updateExam: async (examId, examData) => {
    await mockDelay(800);
    
    console.log('Mock: Updating exam', { examId, ...examData });
    
    return {
      success: true,
      message: 'Exam updated successfully',
      examId: examId,
      examName: examData.examName,
      examDate: examData.examDate,
    };
  },

  // Create Offer
  createOffer: async (offerData) => {
    await mockDelay(800);
    
    console.log('Mock: Creating offer', offerData);
    
    return {
      success: true,
      message: 'Offer created successfully',
      offerId: Math.floor(Math.random() * 10000),
      offerName: offerData.offerName,
      discountPercentage: offerData.discountPercentage,
    };
  },

  // Update Offer
  updateOffer: async (offerId, offerData) => {
    await mockDelay(800);
    
    console.log('Mock: Updating offer', { offerId, ...offerData });
    
    return {
      success: true,
      message: 'Offer updated successfully',
      offerId: offerId,
      offerName: offerData.offerName,
      discountPercentage: offerData.discountPercentage,
    };
  },

  // Create Bestseller
  createBestseller: async (bestsellerData) => {
    await mockDelay(800);
    
    console.log('Mock: Creating bestseller', bestsellerData);
    
    return {
      success: true,
      message: 'Bestseller created successfully',
      bestsellerId: Math.floor(Math.random() * 10000),
      bookId: bestsellerData.bookId,
      bookTitle: bestsellerData.bookTitle,
      rating: bestsellerData.rating,
    };
  },

  // Update Bestseller
  updateBestseller: async (bestsellerId, bestsellerData) => {
    await mockDelay(800);
    
    console.log('Mock: Updating bestseller', { bestsellerId, ...bestsellerData });
    
    return {
      success: true,
      message: 'Bestseller updated successfully',
      bestsellerId: bestsellerId,
      bookId: bestsellerData.bookId,
      bookTitle: bestsellerData.bookTitle,
      rating: bestsellerData.rating,
    };
  },
};

export default mockApiResponses;
