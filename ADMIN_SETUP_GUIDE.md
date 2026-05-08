# BooksKaBazaar Admin Dashboard Setup Guide

## Overview

This admin dashboard provides a professional, production-ready interface for managing the BooksKaBazaar bookstore. It includes authentication, inventory management, and a clean, modern UI built with Tailwind CSS and Framer Motion animations.

## File Structure

```
src/
├── layouts/
│   └── AdminLayout.jsx          # Main admin layout with sidebar
├── pages/
│   └── admin/
│       ├── AdminLogin.jsx       # Login page
│       ├── Dashboard.jsx        # Admin dashboard home
│       └── Inventory.jsx        # Book inventory management
├── components/
│   ├── admin/
│   │   └── AddBook.jsx          # Add/Edit book modal with image upload
│   └── routing/
│       └── ProtectedRoute.jsx   # Route protection component
├── context/
│   └── FlyToCartContext.jsx     # (Existing) Flying cart animation context
├── utils/
│   └── mockAdminBooks.js        # Mock book data for admin
└── App.jsx                      # Updated with routing
```

## Key Features

### 1. AdminLayout Component

**Location:** `src/layouts/AdminLayout.jsx`

The main layout wrapper that provides:
- **Sidebar Navigation** (260px wide, dark slate)
  - Logo with brand name
  - Navigation links (Dashboard, Inventory, Orders, Settings)
  - Admin profile section with logout button
  - Smooth hover animations on links
  
- **Main Content Area**
  - Sticky header with page title and quick actions
  - Scrollable main content with fade-in animation
  - Responsive mobile menu toggle

**Usage:**
```javascript
<AdminLayout>
  <Dashboard />
</AdminLayout>
```

### 2. Inventory Page

**Location:** `src/pages/admin/Inventory.jsx`

Features:
- **Search Bar:** Filter books by title, author, or category (real-time)
- **High-End Table Display:**
  - Book thumbnail, title, author
  - Category badge (blue)
  - Price display
  - Stock status (color-coded: green > 20, yellow 10-20, red < 10)
  - Edit/Delete action buttons
  
- **Responsive:** Horizontal scroll on mobile devices
- **Animations:** Staggered row animations on load

**Usage:**
```javascript
<Inventory 
  onAddBook={() => setShowAddBook(true)}
  onEditBook={(book) => handleEdit(book)}
  onDeleteBook={(bookId) => handleDelete(bookId)}
/>
```

### 3. AddBook Modal

**Location:** `src/components/admin/AddBook.jsx`

Features:
- **Slide-over Modal Design** (from right, 448px max-width)
- **Image Upload:**
  - Drag-and-drop support
  - Click to browse files
  - S3 integration placeholder (see S3 section below)
  - Image preview before submission
  
- **Form Fields:**
  - Title (required)
  - Author (required)
  - Price (required)
  - Category (dropdown)
  - Stock quantity
  - ISBN number
  - Description (textarea)

- **Animations:**
  - Slide-in/slide-out transitions
  - Form validation feedback

**Usage:**
```javascript
<AddBook 
  isOpen={showAddBook}
  onClose={() => setShowAddBook(false)}
  onSubmit={(formData) => {
    console.log("New book:", formData);
    // Handle API call here
  }}
/>
```

### 4. ProtectedRoute Component

**Location:** `src/components/routing/ProtectedRoute.jsx`

Features:
- Checks for admin token in localStorage
- Redirects to login if not authenticated
- Shows access denied message if user lacks ADMIN role
- Can be extended to check specific role permissions

**Usage:**
```javascript
<Route
  path="/admin/*"
  element={
    <ProtectedRoute requiredRole="ADMIN">
      <AdminLayout>
        {/* admin routes */}
      </AdminLayout>
    </ProtectedRoute>
  }
/>
```

### 5. Admin Login Page

**Location:** `src/pages/admin/AdminLogin.jsx`

Features:
- Clean, centered login form
- Demo credentials display
- Error handling with animations
- Stores admin token to localStorage on successful login

**Demo Credentials:**
- Email: `admin@booksbazaar.com`
- Password: `admin123`

## Routing Structure

The app uses React Router v6 with the following structure:

```javascript
/                      // Main home page with products
/admin-login           // Admin login page
/admin                 // Dashboard (protected)
/admin/inventory       // Inventory management (protected)
/admin/orders          // Orders page (protected, placeholder)
/admin/settings        // Settings page (protected, placeholder)
```

## S3 Integration (Image Upload)

### Placeholder Function Location

**File:** `src/components/admin/AddBook.jsx` (lines ~80-95)

### Current Implementation

The drag-and-drop handler creates a data URL preview and logs the simulated S3 upload.

### Production S3 Integration Steps

1. **Get Pre-signed URL from Backend:**
   ```javascript
   const response = await fetch('/api/admin/get-s3-presigned-url', {
     method: 'POST',
     body: JSON.stringify({ fileName, fileType })
   });
   const { presignedUrl, s3Key } = await response.json();
   ```

2. **Upload to S3 Directly:**
   ```javascript
   await fetch(presignedUrl, {
     method: 'PUT',
     body: file,
     headers: { 'Content-Type': file.type }
   });
   ```

3. **Get Final S3 URL:**
   ```javascript
   const s3ImageUrl = presignedUrl.split('?')[0]; // Or from backend response
   setFormData(prev => ({ ...prev, imageURL: s3ImageUrl }));
   ```

## Design System

### Colors
- **Primary Accent:** `#E31E2E` (Red) - Active links, buttons
- **Sidebar:** `#0f172a` (Slate-900)
- **Background:** `#FAFAFA` (Off-white)
- **Text:** Gray-900, Gray-700, Gray-600

### Typography
- Font: Inter / Plus Jakarta Sans
- **Heading:** Bold, size varies (h1-h4)
- **Body:** Regular, 14px
- **Small:** 12px, Gray-500

### Spacing
- Page padding: `p-6`
- Component gap: `gap-4` to `gap-8`
- Section spacing: `space-y-6`

### Animations
- Sidebar width transition: 0.3s ease
- Link hover: Subtle x-translate (4px)
- Page fade-in: 0.3s opacity
- Modal slide: 0.25s spring (damping: 25, stiffness: 200)
- Table row stagger: 0.1s between each

## Tailwind Utilities Used

**Tailwind v4 Syntax:**
- Use `bg-linear-to-r` instead of `bg-gradient-to-r`
- Use `shrink-0` instead of `flex-shrink-0`
- Use `grow` instead of `flex-grow`

**Color System:**
- `from-*/to-*` for gradients
- `text-*-600` for status colors (blue, green, red, yellow)
- `bg-*-50` for light backgrounds

## Development Notes

### Mock Data

Mock books are in `src/utils/mockAdminBooks.js`. Update this file to modify the default inventory data.

### Authentication State

Admin authentication is stored in `localStorage.adminToken`. In production:
- Replace with secure JWT token storage
- Implement proper backend authentication
- Add token refresh logic
- Use secure HTTP-only cookies

### Performance Optimizations

1. **Table Search:** Uses `useMemo` to avoid unnecessary re-renders
2. **Animations:** Framer Motion handles GPU-accelerated animations
3. **Image Upload:** Validates file type before processing
4. **Sidebar:** Animated width change instead of remount

### Extending the Dashboard

To add new admin pages:

1. Create new component in `src/pages/admin/YourPage.jsx`
2. Add route in `App.jsx`:
   ```javascript
   <Route path="your-page" element={<YourPage />} />
   ```
3. Add navigation link in `AdminLayout.jsx` navLinks array

## Testing the Admin Dashboard

1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:5173/admin-login`
3. Use demo credentials
4. Explore Dashboard, Inventory, Add Book features

## Future Enhancements

- [ ] Real API integration for book CRUD operations
- [ ] S3 image upload with pre-signed URLs
- [ ] Order management system
- [ ] Analytics and reporting
- [ ] Bulk import/export for inventory
- [ ] Customer management section
- [ ] Sales analytics dashboard
- [ ] Email notification settings

## Troubleshooting

**Issue:** Routes not working
- Solution: Ensure `react-router-dom` is installed: `npm install react-router-dom`

**Issue:** Admin token not persisting
- Solution: Check localStorage isn't being cleared by browser settings

**Issue:** Sidebar not hiding on mobile
- Solution: Ensure window width change listener is working (browser devtools responsive mode)

**Issue:** Images not uploading
- Solution: Check console for file validation errors; ensure drag-drop area is properly configured
