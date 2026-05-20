# 🎭 SuperAdmin Panel - Mock API Testing Guide

## Overview

The SuperAdmin Panel now includes **Mock API responses** so you can test and develop without needing the backend server running. This is perfect for frontend development and testing!

---

## ✨ What's Included in Mock API

✅ **Login** - Returns valid JWT token
✅ **Ebook Upload** - Simulates file upload
✅ **Exam Create/Update** - Simulates exam operations
✅ **Offer Create/Update** - Simulates offer operations
✅ **Bestseller Create/Update** - Simulates bestseller operations

All mock responses:
- Include realistic data
- Have built-in delays to simulate network
- Log to console for debugging
- Return proper success messages

---

## 🚀 Quick Start

### Step 1: Ensure Mock API is Enabled

Check your `.env` file:

```env
VITE_USE_MOCK_API=true
```

Or it uses `true` by default automatically.

### Step 2: Start Frontend Dev Server

```bash
cd f:\BooksKaBazaar
npm install
npm run dev
```

### Step 3: Access SuperAdmin

Open browser:
```
http://localhost:5173/superadmin/login
```

### Step 4: Login with Default Credentials

```
Username: admin
Password: password123
```

That's it! ✅ No backend needed!

---

## 🎯 Testing Each Module

### 1. **Ebook Management**

1. Click "Ebook Management" tab
2. Fill in:
   - Book Title: "Test Book"
   - Author: "Test Author"
   - Upload: Any PDF file
3. Click "Upload Ebook"
4. ✅ See success message!

**Console Output:**
```
📱 Mock API: uploadEbook
Mock: Uploading ebook {
  bookTitle: 'Test Book',
  author: 'Test Author',
  fileName: 'document.pdf',
  fileSizeKB: 125
}
```

### 2. **Exam Management**

1. Click "Exam Management" tab
2. Fill in all fields:
   - Exam Name: "JEE Advanced 2024"
   - Description: "Advanced level exam"
   - Exam Date: Pick a date
   - Total Questions: 180
3. Click "Create Exam"
4. ✅ See success message!

**To Update:**
1. Toggle to "Update Exam" mode
2. Enter Exam ID (any number)
3. Update fields
4. Click "Update Exam"

### 3. **Offer Management**

1. Click "Offer Management" tab
2. Fill in all fields:
   - Offer Name: "Summer Sale"
   - Description: "50% discount"
   - Discount: 50
   - Valid From: Today
   - Valid To: Next month
3. Click "Create Offer"
4. ✅ See success message!

### 4. **Bestseller Management**

1. Click "Bestseller Management" tab
2. Fill in all fields:
   - Book ID: 123
   - Book Title: "Popular Book"
   - Sales Count: 5000
   - Rating: 4.5
3. Click "Add to Bestseller"
4. ✅ See success message!

---

## 🔄 Switching Between Mock and Real Backend

### Use Mock API (Development)

**In `.env` file:**
```env
VITE_USE_MOCK_API=true
VITE_API_URL=http://localhost:8080/api
```

Console output:
```
🔧 API Mode: 🎭 MOCK API (Testing)
```

### Use Real Backend (Production)

**In `.env` file:**
```env
VITE_USE_MOCK_API=false
VITE_API_URL=http://localhost:8080/api
```

Console output:
```
🔧 API Mode: 🌐 Real Backend
```

**Important:** Only switch to real backend when:
1. Backend is running on `http://localhost:8080`
2. CORS is configured in backend
3. All endpoints are implemented

---

## 📊 Mock API Response Examples

### Login Success
```javascript
{
  success: true,
  message: 'Login successful',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

### Login Failure
```javascript
{
  success: false,
  message: 'Invalid credentials',
  token: null
}
```

### Ebook Upload Response
```javascript
{
  success: true,
  message: 'Ebook uploaded successfully',
  bookId: 4827,
  bookTitle: 'Test Book',
  author: 'Test Author'
}
```

### Exam Creation Response
```javascript
{
  success: true,
  message: 'Exam created successfully',
  examId: 2934,
  examName: 'JEE Advanced 2024',
  examDate: '2024-06-02'
}
```

---

## 🐛 Debugging & Console Logs

### Enable Console Logs

Open browser DevTools:
```
Chrome/Edge: F12
Firefox: F12
Safari: Cmd + Option + I
```

Go to **Console** tab to see:

```
🔧 API Mode: 🎭 MOCK API (Testing)
📱 Mock API: login
📱 Mock API: uploadEbook
```

### Example Full Console Session

```
superAdminApi.js:8 🔧 API Mode: 🎭 MOCK API (Testing)
mockApiResponses.js:52 Mock: Creating exam {
  examName: 'JEE Advanced 2024',
  examDescription: 'Advanced level exam',
  examDate: '2024-06-02',
  totalQuestions: 180
}
superAdminApi.js:43 📱 Mock API: createExam
```

---

## ⏱️ Simulated Network Delays

Each mock API call includes a simulated delay:

```javascript
// Default delays per endpoint
login: 1000ms (1 second)
uploadEbook: 1200ms (1.2 seconds)
createExam: 800ms
updateExam: 800ms
createOffer: 800ms
updateOffer: 800ms
createBestseller: 800ms
updateBestseller: 800ms
```

This simulates real network behavior! You'll see the loading spinner while requests "process".

---

## 🎓 Understanding the Mock Files

### File Structure
```
src/services/superadmin/
├── superAdminApi.js          ← Main API service (with mock toggle)
└── mockApiResponses.js       ← Mock data & responses
```

### How It Works

1. **superAdminApi.js** checks `USE_MOCK_API` flag
2. If true → Uses `mockApiResponses.js`
3. If false → Uses real backend fetch
4. Same response format either way

### Example Code Flow

```javascript
// In superAdminApi.js
if (USE_MOCK_API) {
  console.log('📱 Mock API: login');
  return await mockApiResponses.login(username, password);
}
// Otherwise, fetch from real backend...
```

---

## ✅ Complete Testing Checklist

### Without Backend (Using Mock)

- [ ] Login successfully
- [ ] Dashboard loads
- [ ] All tabs are accessible
- [ ] Upload ebook (choose any PDF)
- [ ] Create exam
- [ ] Update exam
- [ ] Create offer
- [ ] Update offer
- [ ] Create bestseller
- [ ] Update bestseller
- [ ] See success messages
- [ ] Mobile responsive works
- [ ] Logout works

### When Backend is Ready

1. Update `.env`:
   ```env
   VITE_USE_MOCK_API=false
   ```

2. Start backend server

3. Test all features again with real backend

---

## 🔄 Migration from Mock to Real Backend

### When Backend is Ready:

**Step 1: Update .env**
```env
VITE_USE_MOCK_API=false
VITE_API_URL=http://localhost:8080/api
```

**Step 2: Start Backend**
```bash
cd backend-project
mvn spring-boot:run
```

**Step 3: No Code Changes Needed!**
The same API calls automatically use real backend!

**Step 4: Test Everything**
All functionality should work exactly the same.

---

## 💡 Pro Tips

### Tip 1: Check API Mode in Console
```javascript
// In browser console
console.log(import.meta.env.VITE_USE_MOCK_API)
// Returns: true (mock) or false (real)
```

### Tip 2: Test Form Validation
Mock API validates same as backend would:
- Exam date must be valid
- Offer dates: From < To
- Rating: 0-5
- Discount: 0-100

### Tip 3: Add Custom Mock Data
Edit `mockApiResponses.js` to return different data:
```javascript
login: async (username, password) => {
  // Add custom logic here
  return { success: true, token: 'custom-token' };
}
```

### Tip 4: Simulate Errors
For testing error handling:
```javascript
// In mockApiResponses.js
if (username !== 'admin') {
  throw new Error('Custom error message');
}
```

---

## 📝 What Gets Logged

### Successful API Call
```
📱 Mock API: createOffer
Mock: Creating offer {
  offerName: 'Summer Sale 2024',
  offerDescription: 'Get up to 50% off',
  discountPercentage: 50,
  validFrom: '2024-06-01',
  validTo: '2024-08-31'
}
✅ Offer created successfully
```

### Upload with File
```
📱 Mock API: uploadEbook
Mock: Uploading ebook {
  bookTitle: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  fileName: 'gatsby.pdf',
  fileSizeKB: 512
}
✅ Ebook uploaded successfully
```

---

## 🚀 Next Steps

### Today
- [ ] Test with mock API
- [ ] Verify all modules work
- [ ] Check form validation

### When Backend Ready
- [ ] Switch `VITE_USE_MOCK_API=false`
- [ ] Start backend server
- [ ] Test integration

### Before Production
- [ ] Switch to real backend
- [ ] Test all endpoints
- [ ] Configure CORS
- [ ] Set up proper credentials

---

## ❓ FAQ

**Q: Will mock API data persist?**
A: No, page refresh clears all data. (Mock API doesn't store data)

**Q: Can I modify mock responses?**
A: Yes! Edit `mockApiResponses.js` for custom responses.

**Q: Is it production-ready?**
A: No, remove `VITE_USE_MOCK_API=true` before deploying.

**Q: Does it affect real backend?**
A: No, when you switch to real backend, it's completely separate.

**Q: Can I test both at the same time?**
A: Yes! Change `.env` and refresh browser.

---

## 🎉 You're All Set!

Now you can:
✅ Test all features without backend
✅ Develop frontend independently
✅ Easily switch to real backend later
✅ Show features to team immediately

**Happy Testing! 🚀**

---

**Version**: 1.0.0
**Mock API Mode**: Enabled by Default
**Status**: Ready for Testing
