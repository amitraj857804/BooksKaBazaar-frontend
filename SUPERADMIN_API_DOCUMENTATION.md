# SuperAdmin Panel - API Integration Documentation

## 📡 API Overview

The SuperAdmin Panel communicates with the backend through well-defined RESTful endpoints. All endpoints (except login) require JWT authentication via the `Authorization: Bearer <token>` header.

## 🔐 Authentication Endpoint

### Login
**Endpoint**: `POST /api/auth/superadmin/login`

**Request Body**:
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid credentials",
  "token": null
}
```

**Frontend Flow**:
1. User enters username and password
2. `superAdminApi.login(username, password)` is called
3. Response is stored in `SuperAdminContext`
4. Token saved to localStorage
5. Redirect to dashboard

---

## 📚 Ebook Management APIs

### Upload Ebook
**Endpoint**: `POST /api/auth/superadmin/upload-ebook`

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "bookTitle": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "fileName": "the-great-gatsby.pdf",
  "fileContent": "JVBERi0xLjQKJeLj..."  // Base64 encoded PDF content
}
```

**Success Response** (200 OK):
```json
"Ebook uploaded successfully"
```

**Error Response** (500 Internal Server Error):
```json
"Failed to upload ebook"
```

**Frontend Implementation**:
```javascript
// EbookManagement.jsx
const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = reader.result.split(',')[1];
    await superAdminApi.uploadEbook({
      bookTitle,
      author,
      fileName: file.name,
      fileContent: base64
    }, token);
  };
  reader.readAsDataURL(file);
};
```

---

## 📝 Exam Management APIs

### Create Exam
**Endpoint**: `POST /api/auth/superadmin/create-exam`

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "examName": "JEE Advanced 2024",
  "examDescription": "Joint Entrance Examination - Advanced Level",
  "examDate": "2024-06-02",
  "totalQuestions": 180
}
```

**Success Response** (200 OK):
```json
"Exam created successfully"
```

**Error Response** (500 Internal Server Error):
```json
"Error creating exam"
```

### Update Exam
**Endpoint**: `PUT /api/auth/superadmin/update-exam/{examId}`

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters**:
- `examId` (Long): The ID of the exam to update

**Request Body**:
```json
{
  "examName": "JEE Advanced 2024 - Updated",
  "examDescription": "Joint Entrance Examination - Advanced Level (Updated)",
  "examDate": "2024-06-02",
  "totalQuestions": 180
}
```

**Success Response** (200 OK):
```json
"Exam updated successfully"
```

**Error Response** (404 Not Found):
```json
"No exam found"
```

**Error Response** (500 Internal Server Error):
```json
"Error updating exam"
```

**Frontend Implementation**:
```javascript
// ExamManagement.jsx
const handleSubmit = async (e) => {
  const examData = {
    examName,
    examDescription,
    examDate,
    totalQuestions: parseInt(totalQuestions)
  };

  if (mode === 'create') {
    await superAdminApi.createExam(examData, token);
  } else {
    await superAdminApi.updateExam(examId, examData, token);
  }
};
```

---

## 🏷️ Offer Management APIs

### Create Offer
**Endpoint**: `POST /api/auth/superadmin/manage-offers`

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "offerName": "Summer Sale 2024",
  "offerDescription": "Get up to 50% off on all books this summer",
  "discountPercentage": 50.0,
  "validFrom": "2024-06-01",
  "validTo": "2024-08-31"
}
```

**Success Response** (200 OK):
```json
"Offer created successfully"
```

**Error Response** (500 Internal Server Error):
```json
"Error creating an offer"
```

### Update Offer
**Endpoint**: `PUT /api/auth/superadmin/update-offer/{offerId}`

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters**:
- `offerId` (Long): The ID of the offer to update

**Request Body**:
```json
{
  "offerName": "Summer Sale 2024 - Extended",
  "offerDescription": "Get up to 60% off on all books this summer",
  "discountPercentage": 60.0,
  "validFrom": "2024-06-01",
  "validTo": "2024-09-30"
}
```

**Success Response** (200 OK):
```json
"Offer updated successfully"
```

**Error Response** (404 Not Found):
```json
"Offer not found"
```

**Error Response** (500 Internal Server Error):
```json
"Error updating offer"
```

**Frontend Validation**:
```javascript
// OfferManagement.jsx
if (new Date(validFrom) >= new Date(validTo)) {
  throw new Error('Valid To date must be after Valid From date');
}

if (discountPercentage < 0 || discountPercentage > 100) {
  throw new Error('Discount percentage must be between 0-100');
}
```

---

## ⭐ Bestseller Management APIs

### Create Bestseller
**Endpoint**: `POST /api/auth/superadmin/manage-bestseller`

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "bookId": 123,
  "bookTitle": "The Midnight Library",
  "salesCount": 50000,
  "rating": 4.8
}
```

**Success Response** (200 OK):
```json
"Best seller created successfully"
```

**Error Response** (500 Internal Server Error):
```json
"Error creating best seller"
```

### Update Bestseller
**Endpoint**: `PUT /api/auth/superadmin/update-bestseller/{bestsellerId}`

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters**:
- `bestsellerId` (Long): The ID of the bestseller to update

**Request Body**:
```json
{
  "bookId": 123,
  "bookTitle": "The Midnight Library - Updated Stats",
  "salesCount": 75000,
  "rating": 4.9
}
```

**Success Response** (200 OK):
```json
"Best seller updated successfully"
```

**Error Response** (404 Not Found):
```json
"Best seller not found"
```

**Error Response** (500 Internal Server Error):
```json
"Error updating best seller"
```

**Frontend Validation**:
```javascript
// BestsellerManagement.jsx
const rating = parseFloat(formData.rating);
if (rating < 0 || rating > 5) {
  throw new Error('Rating must be between 0 and 5');
}
```

---

## 🔄 API Service Layer Architecture

### superAdminApi.js Structure
```javascript
export const superAdminApi = {
  login: async (username, password) => { ... },
  uploadEbook: async (ebookData, token) => { ... },
  createExam: async (examData, token) => { ... },
  updateExam: async (examId, examData, token) => { ... },
  createOffer: async (offerData, token) => { ... },
  updateOffer: async (offerId, offerData, token) => { ... },
  createBestseller: async (bestsellerData, token) => { ... },
  updateBestseller: async (bestsellerId, bestsellerData, token) => { ... },
};
```

### Error Handling Pattern
```javascript
try {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'API call failed');
  return data;
} catch (error) {
  throw error;  // Propagate to component for display
}
```

---

## 📊 Request/Response Examples

### Complete Login Flow

**1. Frontend Sends Login Request**
```bash
POST /api/auth/superadmin/login HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Content-Length: 45

{"username":"admin","password":"password123"}
```

**2. Backend Validates & Returns Token**
```bash
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 200

{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTYxNjIzOTAyMn0..."
}
```

**3. Frontend Stores Token & Uses for Subsequent Requests**
```bash
POST /api/auth/superadmin/upload-ebook HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{"bookTitle": "...", "author": "...", "fileName": "...", "fileContent": "..."}
```

---

## ✅ Backend Implementation Checklist

### Security
- [ ] Validate JWT token on every protected endpoint
- [ ] Hash and salt passwords
- [ ] Implement CORS for allowed domains
- [ ] Rate limit login endpoint
- [ ] Use HTTPS in production

### Validation
- [ ] Validate all input fields
- [ ] Check file sizes before processing
- [ ] Validate date ranges (validFrom < validTo)
- [ ] Validate numeric ranges (discount: 0-100, rating: 0-5)

### Error Handling
- [ ] Return appropriate HTTP status codes
- [ ] Include meaningful error messages
- [ ] Log errors for debugging
- [ ] Never expose sensitive information

### Data Persistence
- [ ] Save file content securely
- [ ] Store exam data with proper relations
- [ ] Track offer validity dates
- [ ] Maintain bestseller rankings

### Performance
- [ ] Index frequently queried fields
- [ ] Implement pagination for large datasets
- [ ] Use database transactions for consistency
- [ ] Cache static data when appropriate

---

## 🧪 Testing the APIs

### Using cURL

**Login**
```bash
curl -X POST http://localhost:8080/api/auth/superadmin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

**Create Exam**
```bash
curl -X POST http://localhost:8080/api/auth/superadmin/create-exam \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "examName": "JEE Advanced 2024",
    "examDescription": "Advanced Level Exam",
    "examDate": "2024-06-02",
    "totalQuestions": 180
  }'
```

### Using Postman

1. Create new collection: "SuperAdmin APIs"
2. Add login request (store token in variable)
3. Use `{{token}}` in Authorization headers for subsequent requests
4. Test each module endpoint

---

## 🔗 Integration Points

### Frontend to Backend Flow
```
Frontend Form Input
    ↓
Form Validation
    ↓
API Service Call
    ↓
Backend Endpoint
    ↓
Business Logic
    ↓
Database Operation
    ↓
Response with Status Code
    ↓
Frontend Error/Success Handler
    ↓
User Notification
```

---

## 📋 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid/expired token | Logout and login again |
| 403 Forbidden | Missing Authorization header | Verify token is being sent |
| 404 Not Found | Wrong endpoint URL | Check endpoint in backend |
| 500 Internal Server Error | Backend error | Check server logs |
| CORS Error | Frontend domain not allowed | Add to CORS whitelist |
| File upload fails | File too large | Check max file size settings |

---

## 📞 Contact Backend Team

When integrating, ensure backend team has:
- [ ] Implemented all endpoints
- [ ] Configured CORS properly
- [ ] Set up JWT authentication
- [ ] Configured environment variables
- [ ] Set up error logging
- [ ] Tested with Postman/cURL
- [ ] Provided API documentation
- [ ] Set up monitoring/alerting

---

**Last Updated**: 2024
**API Version**: 1.0.0
**Status**: Production Ready
