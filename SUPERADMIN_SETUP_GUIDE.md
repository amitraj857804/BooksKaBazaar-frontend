# SuperAdmin Panel - Setup & Implementation Guide

## 🎯 Overview
The SuperAdmin Panel is a comprehensive management system for controlling platform content including eBooks, Exams, Offers, and Bestsellers. It features subdomain routing and JWT-based authentication.

## 📁 Project Structure

```
src/
├── pages/superadmin/
│   ├── SuperAdminLogin.jsx          # Login page with form validation
│   ├── SuperAdminDashboard.jsx      # Main dashboard with tab navigation
│   └── modules/
│       ├── EbookManagement.jsx      # Upload and manage eBooks
│       ├── ExamManagement.jsx       # Create/Update exams
│       ├── OfferManagement.jsx      # Create/Update offers
│       └── BestsellerManagement.jsx # Manage bestsellers
├── context/superadmin/
│   └── SuperAdminContext.jsx        # Authentication & state management
├── services/superadmin/
│   └── superAdminApi.js             # API service layer
├── components/superadmin/
│   └── SuperAdminProtectedRoute.jsx # Route protection wrapper
└── hooks/superadmin/
    └── (Future custom hooks)
```

## 🔐 Authentication Flow

### 1. Login Process
```
User Input (username/password)
    ↓
SuperAdminApi.login()
    ↓
Backend Validation (/api/auth/superadmin/login)
    ↓
JWT Token Response
    ↓
Store in localStorage
    ↓
Redirect to Dashboard
```

### 2. Protected Routes
- All dashboard routes require active JWT token
- SuperAdminProtectedRoute component checks authentication
- Automatic redirect to login if not authenticated
- Token persists across page refreshes

## 🌐 Subdomain Routing Setup

### Development Setup (Local Testing)
For testing subdomain routing locally, edit your **hosts** file:

**Windows (C:\Windows\System32\drivers\etc\hosts):**
```
127.0.0.1 localhost
127.0.0.1 superadmin.localhost
127.0.0.1 app.localhost
```

**Mac/Linux (/etc/hosts):**
```
127.0.0.1 localhost
127.0.0.1 superadmin.localhost
127.0.0.1 app.localhost
```

### Production Setup
In production, your DNS should point:
- `superadmin.bookskabazaar.com` → SuperAdmin Dashboard
- `www.bookskabazaar.com` → Main Application

### Nginx Configuration (Production Example)
```nginx
server {
    listen 80;
    server_name superadmin.bookskabazaar.com;
    
    location / {
        proxy_pass http://superadmin-frontend:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name bookskabazaar.com www.bookskabazaar.com;
    
    location / {
        proxy_pass http://app-frontend:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔌 API Endpoints Integration

### Implemented Endpoints

#### Authentication
- **POST** `/api/auth/superadmin/login`
  - Body: `{ username, password }`
  - Response: `{ success, message, token }`

#### Ebook Management
- **POST** `/api/auth/superadmin/upload-ebook`
  - Body: `{ bookTitle, author, fileName, fileContent }`
  - Headers: `Authorization: Bearer {token}`

#### Exam Management
- **POST** `/api/auth/superadmin/create-exam`
  - Body: `{ examName, examDescription, examDate, totalQuestions }`
  - Headers: `Authorization: Bearer {token}`

- **PUT** `/api/auth/superadmin/update-exam/{examId}`
  - Body: `{ examName, examDescription, examDate, totalQuestions }`
  - Headers: `Authorization: Bearer {token}`

#### Offer Management
- **POST** `/api/auth/superadmin/manage-offers`
  - Body: `{ offerName, offerDescription, discountPercentage, validFrom, validTo }`
  - Headers: `Authorization: Bearer {token}`

- **PUT** `/api/auth/superadmin/update-offer/{offerId}`
  - Body: `{ offerName, offerDescription, discountPercentage, validFrom, validTo }`
  - Headers: `Authorization: Bearer {token}`

#### Bestseller Management
- **POST** `/api/auth/superadmin/manage-bestseller`
  - Body: `{ bookId, bookTitle, salesCount, rating }`
  - Headers: `Authorization: Bearer {token}`

- **PUT** `/api/auth/superadmin/update-bestseller/{bestsellerId}`
  - Body: `{ bookId, bookTitle, salesCount, rating }`
  - Headers: `Authorization: Bearer {token}`

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and update:
```bash
VITE_API_URL=http://localhost:8080/api
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access SuperAdmin Panel
- **URL**: `http://localhost:5173/superadmin/login`
- **Username**: admin (configure in backend)
- **Password**: password123 (configure in backend)

### 5. Testing Subdomains (Development)
After editing hosts file:
- **SuperAdmin**: `http://superadmin.localhost:5173/superadmin/login`
- **Main App**: `http://app.localhost:5173/`

## 🎨 Component Features

### SuperAdminLogin
- Email/password validation
- Loading states
- Error handling with visual feedback
- Responsive design
- Icons from lucide-react

### SuperAdminDashboard
- Responsive sidebar navigation
- Tab-based module switching
- Mobile hamburger menu
- User welcome display
- Logout functionality
- Dark theme (slate + amber accent)

### Management Modules

#### EbookManagement
- Book title & author input
- PDF file upload
- Base64 encoding for file transmission
- Success/error notifications
- Form reset after submission

#### ExamManagement
- Create/Update toggle modes
- Exam name, description, date
- Total questions input
- Date validation
- Conditional exam ID field for updates

#### OfferManagement
- Create/Update modes
- Offer details (name, description, discount %)
- Date range validation
- Ensures Valid To > Valid From
- Discount percentage constraints (0-100)

#### BestsellerManagement
- Create/Update modes
- Book information input
- Sales count tracking
- Rating system (0-5 stars)
- Validation for all fields

## 🔄 State Management

### SuperAdminContext
Manages:
- `isSuperAdmin` - Authentication status
- `token` - JWT token for API calls
- `user` - Current user information
- `loading` - Loading state during login
- `error` - Error messages

### localStorage Keys
- `superAdminToken` - JWT token persistence
- `superAdminUser` - User data persistence

## 🛡️ Security Features

1. **JWT Authentication**: Token-based secure API calls
2. **Protected Routes**: SuperAdminProtectedRoute prevents unauthorized access
3. **Token Persistence**: Auto-login on page refresh
4. **Authorization Headers**: All API calls include Bearer token
5. **Input Validation**: Form validation before submission

## 📱 Responsive Design

- **Mobile**: Full-featured hamburger sidebar
- **Tablet**: Optimized touch interactions
- **Desktop**: Full sidebar with content area
- **Dark Theme**: Slate (800) background with amber (500) accents

## 🐛 Troubleshooting

### "Login successful but can't access dashboard"
- Check if token is stored in localStorage
- Verify backend is running and accessible
- Check VITE_API_URL in environment

### "API calls failing with CORS error"
- Configure CORS in your backend
- Ensure credentials are being sent with requests

### "Subdomain not resolving"
- Verify hosts file is correctly updated
- Clear DNS cache: `ipconfig /flushdns` (Windows)
- Restart browser

### "File upload failing"
- Check max file size limits
- Verify base64 encoding is working
- Check backend file handling configuration

## 📈 Future Enhancements

1. **Dashboard Analytics**: Add charts and statistics
2. **Bulk Import**: CSV/Excel import for multiple records
3. **Advanced Filtering**: Search and filter capabilities
4. **Activity Logging**: Track all superadmin actions
5. **Role-based Access**: Multiple superadmin roles
6. **Two-Factor Authentication**: Enhanced security
7. **Audit Trail**: Complete change history

## 🤝 Integration Checklist

- [ ] Backend SuperAdmin controller is deployed
- [ ] JWT token generation is working
- [ ] CORS is configured for frontend domain
- [ ] Environment variables are set correctly
- [ ] Subdomain DNS records are configured
- [ ] SSL/TLS certificates are installed
- [ ] Rate limiting is configured for login endpoint
- [ ] Password hashing is implemented in backend
- [ ] Logging and monitoring is set up
- [ ] Backup strategy for superadmin data is in place

## 📞 Support

For issues or questions:
1. Check console logs for errors
2. Verify all environment variables are set
3. Ensure backend API is running
4. Check network tab in developer tools

## 📝 Notes

- All timestamps should be in ISO 8601 format
- File content is transmitted as base64 encoded strings
- Consider implementing refresh token mechanism for long sessions
- Set appropriate token expiration times in backend
- Implement rate limiting for security
