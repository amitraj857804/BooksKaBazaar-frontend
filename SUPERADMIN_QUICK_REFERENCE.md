# SuperAdmin Panel - Developer Quick Reference

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Navigate to project
cd f:\BooksKaBazaar

# 2. Install dependencies
npm install

# 3. Create .env file
copy .env.example .env

# 4. Update .env
VITE_API_URL=http://localhost:8080/api

# 5. Start dev server
npm run dev

# 6. Open in browser
http://localhost:5173/superadmin/login
```

**Default Credentials**: 
- Username: `admin`
- Password: `password123`

---

## 📂 File Locations

| File | Purpose | Location |
|------|---------|----------|
| Login Page | Auth UI | `src/pages/superadmin/SuperAdminLogin.jsx` |
| Dashboard | Main hub | `src/pages/superadmin/SuperAdminDashboard.jsx` |
| Modules | Management UIs | `src/pages/superadmin/modules/*.jsx` |
| Auth Context | State | `src/context/superadmin/SuperAdminContext.jsx` |
| API Service | Backend calls | `src/services/superadmin/superAdminApi.js` |
| Routes | Protection | `src/App.jsx` |

---

## 🔗 API Endpoints Quick Reference

### Login
```javascript
// POST /api/auth/superadmin/login
await superAdminApi.login('admin', 'password123');
// Returns: { success, message, token }
```

### Ebook
```javascript
// POST /api/auth/superadmin/upload-ebook
await superAdminApi.uploadEbook({ 
  bookTitle, author, fileName, fileContent 
}, token);
```

### Exam
```javascript
// POST /api/auth/superadmin/create-exam
await superAdminApi.createExam({ 
  examName, examDescription, examDate, totalQuestions 
}, token);

// PUT /api/auth/superadmin/update-exam/{id}
await superAdminApi.updateExam(id, { ... }, token);
```

### Offer
```javascript
// POST /api/auth/superadmin/manage-offers
await superAdminApi.createOffer({ 
  offerName, offerDescription, discountPercentage, validFrom, validTo 
}, token);

// PUT /api/auth/superadmin/update-offer/{id}
await superAdminApi.updateOffer(id, { ... }, token);
```

### Bestseller
```javascript
// POST /api/auth/superadmin/manage-bestseller
await superAdminApi.createBestseller({ 
  bookId, bookTitle, salesCount, rating 
}, token);

// PUT /api/auth/superadmin/update-bestseller/{id}
await superAdminApi.updateBestseller(id, { ... }, token);
```

---

## 🎯 Common Code Snippets

### Use SuperAdmin Context
```javascript
import { useSuperAdmin } from './context/superadmin/SuperAdminContext';

function MyComponent() {
  const { token, user, login, logout, isSuperAdmin } = useSuperAdmin();
  
  return (
    <div>
      {isSuperAdmin && <p>Hello {user?.username}</p>}
    </div>
  );
}
```

### Make API Call
```javascript
import { superAdminApi } from './services/superadmin/superAdminApi';
import { useSuperAdmin } from './context/superadmin/SuperAdminContext';

function MyComponent() {
  const { token } = useSuperAdmin();
  
  const handleAction = async () => {
    try {
      const result = await superAdminApi.createExam(data, token);
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
}
```

### Detect Subdomain
```javascript
import useSubdomainDetection from './hooks/superadmin/useSubdomainDetection';
import { SubdomainUtils } from './utils/subdomainUtils';

// Method 1: Hook
const { isSuperAdminSubdomain } = useSubdomainDetection();

// Method 2: Utility
const isSuperAdmin = SubdomainUtils.isSuperAdminAccess();
const subdomain = SubdomainUtils.getCurrentSubdomain();
```

### Protected Route
```javascript
import SuperAdminProtectedRoute from './components/superadmin/SuperAdminProtectedRoute';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';

// In App.jsx Routes
<Route
  path="/superadmin/dashboard"
  element={
    <SuperAdminProtectedRoute>
      <SuperAdminDashboard />
    </SuperAdminProtectedRoute>
  }
/>
```

---

## 🛠️ Common Tasks

### Add New API Endpoint

1. **Update superAdminApi.js**
```javascript
newEndpoint: async (data, token) => {
  const response = await fetch(`${API_BASE_URL}/api/endpoint`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
```

2. **Use in Component**
```javascript
const result = await superAdminApi.newEndpoint(data, token);
```

### Add New Management Module

1. **Create file**: `src/pages/superadmin/modules/NewModule.jsx`
2. **Import in Dashboard**: `import NewModule from './modules/NewModule'`
3. **Add to tabs array**:
```javascript
{
  id: 'new',
  label: 'New Module',
  icon: Icon,
  component: NewModule,
}
```

### Add Form Validation

```javascript
const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};
  if (!formData.field) newErrors.field = 'Field is required';
  if (formData.email && !formData.email.includes('@')) {
    newErrors.email = 'Invalid email';
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  // Proceed with submission
};
```

---

## 🎨 Styling Reference

### Tailwind Classes Used
```javascript
// Buttons
'bg-amber-500 hover:bg-amber-600'
'bg-slate-700 hover:bg-slate-600'

// Inputs
'bg-slate-700 border border-slate-600'
'focus:ring-2 focus:ring-amber-500'

// Text
'text-white'
'text-slate-300'
'text-slate-400'

// Layout
'flex items-center justify-center'
'grid grid-cols-1 md:grid-cols-2'
```

### Add Custom Styling
```javascript
// In component
const customClass = `w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg`;

// Or use Tailwind @apply
// In CSS file
<style>
.custom-btn {
  @apply px-4 py-2 rounded-lg font-semibold transition;
}
</style>
```

---

## 🐛 Debugging Tips

### Enable Debug Logging
```javascript
// In component
console.log('Debug:', {
  token,
  user,
  formData,
  apiUrl: import.meta.env.VITE_API_URL,
});
```

### Check API Call
```javascript
// Browser DevTools → Network tab
// 1. Go to Network tab
// 2. Filter by 'auth'
// 3. Look for your API call
// 4. Check Request/Response tabs
```

### Check localStorage
```javascript
// In browser console
localStorage.getItem('superAdminToken')
localStorage.getItem('superAdminUser')
JSON.parse(localStorage.getItem('superAdminUser'))
```

### Check Environment Variables
```javascript
// In any component
console.log('API URL:', import.meta.env.VITE_API_URL)
```

---

## ⚠️ Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module` | Missing import | Check file path and spelling |
| `401 Unauthorized` | Invalid token | Clear localStorage, re-login |
| `CORS error` | Backend CORS config | Check backend CORS settings |
| `404 Not Found` | Wrong API URL | Check VITE_API_URL in .env |
| `Token undefined` | Not logged in | Check SuperAdminContext provider |
| `File too large` | Upload size limit | Check backend max file size |

---

## 📱 Responsive Breakpoints

```javascript
// Tailwind breakpoints used
sm: 640px      // Mobile landscape
md: 768px      // Tablet
lg: 1024px     // Desktop
xl: 1280px     // Large desktop
```

### Example Responsive Class
```javascript
'grid grid-cols-1 md:grid-cols-2 gap-6'
// Mobile: 1 column
// Tablet+: 2 columns
```

---

## 🔐 Security Checklist

When modifying code:
- [ ] Never expose API keys in code
- [ ] Use environment variables for secrets
- [ ] Validate all user inputs
- [ ] Check token before API calls
- [ ] Use HTTPS in production
- [ ] Sanitize user data before display

---

## 📊 State Management Pattern

```javascript
// 1. Define context
const Context = createContext();

// 2. Create provider
export const ContextProvider = ({ children }) => {
  const [state, setState] = useState();
  return <Context.Provider value={state}>{children}</Context.Provider>;
};

// 3. Create hook
export const useContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('Hook must be inside provider');
  return context;
};

// 4. Use in component
const { state } = useContext();
```

---

## 🧪 Testing Module Locally

### Test Ebook Upload
```
1. Click Ebook Management tab
2. Fill: Book Title = "Test Book"
3. Fill: Author = "Test Author"
4. Upload: Select any PDF
5. Click "Upload Ebook"
6. Check success message
```

### Test Exam Creation
```
1. Click Exam Management tab
2. Ensure "Create New Exam" is selected
3. Fill all required fields
4. Click "Create Exam"
5. Check success message
```

### Test Offer Creation
```
1. Click Offer Management tab
2. Fill all offer details
3. Set dates: From < To
4. Enter discount: 0-100
5. Click "Create Offer"
6. Check success message
```

---

## 🚀 Production Deployment

### Build
```bash
npm run build
```

### Environment Variables (Production)
```
VITE_API_URL=https://api.bookskabazaar.com
```

### Serve Static Files
```bash
npm run preview
```

### Docker (if using)
```bash
docker build -t superadmin .
docker run -p 80:5173 superadmin
```

---

## 📞 Quick Links

| Resource | Link |
|----------|------|
| Setup Guide | `SUPERADMIN_SETUP_GUIDE.md` |
| API Docs | `SUPERADMIN_API_DOCUMENTATION.md` |
| Checklist | `SUPERADMIN_IMPLEMENTATION_CHECKLIST.md` |
| ReadMe | `SUPERADMIN_README.md` |
| Executive Summary | `SUPERADMIN_EXECUTIVE_SUMMARY.md` |

---

## 💡 Pro Tips

### Tip 1: Fast Development
Use Redux DevTools + React DevTools for easier debugging

### Tip 2: API Testing
Use Postman to test backend endpoints before frontend integration

### Tip 3: Hot Reload
Vite automatically reloads on file save - no need to refresh browser

### Tip 4: Console Logging
Use conditional logging:
```javascript
const isDev = import.meta.env.DEV;
isDev && console.log('Debug info');
```

### Tip 5: Reusable Validation
Create a validation hook:
```javascript
const useFormValidation = (initialData, validate) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const newData = {...data, [e.target.name]: e.target.value};
    setData(newData);
    setErrors(validate(newData));
  };
  
  return { data, handleChange, errors };
};
```

---

## ✅ Pre-Launch Checklist

- [ ] All modules tested locally
- [ ] API endpoints verified
- [ ] Environment variables configured
- [ ] CORS enabled on backend
- [ ] SSL certificates installed
- [ ] DNS records configured
- [ ] Database migrations completed
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Documentation reviewed
- [ ] Team trained on system
- [ ] Go-live approval obtained

---

## 🎯 Next Actions

1. **Today**: Test the system locally
2. **Tomorrow**: Brief backend team
3. **This Week**: Complete integration testing
4. **Next Week**: Deploy to production

---

**Keep this guide handy while developing!**

**Version**: 1.0.0
**Last Updated**: 2024
