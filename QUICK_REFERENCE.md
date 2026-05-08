# Authentication System - Quick Reference & API

## 🎯 Quick Start

### 1. Open Auth Modal
```jsx
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { openAuthModal } = useAuth();
  
  return <button onClick={openAuthModal}>Login / Sign Up</button>;
}
```

### 2. Close Auth Modal (programmatically)
```jsx
const { closeAuthModal } = useAuth();
closeAuthModal();
```

### 3. Check if Modal is Open
```jsx
const { isAuthModalOpen } = useAuth();
if (isAuthModalOpen) {
  // Modal is open
}
```

---

## 📊 Component Tree

```
<AuthProvider>
  <AuthModal>
    <Backdrop blur />
    <ModalContainer spring-animation>
      <Header>
        <Title />
        <CloseButton />
      </Header>
      
      <FormContainer slide-animation>
        <LoginForm OR SignupForm />
      </FormContainer>
      
      <Divider />
      
      <SocialButtons>
        <GoogleButton />
        <GitHubButton />
      </SocialButtons>
    </ModalContainer>
  </AuthModal>
  
  <Navbar useAuth hook />
  <App />
</AuthProvider>
```

---

## 🎨 Styling Reference

### Modal Backdrop
```jsx
className="fixed inset-0 z-40 backdrop-blur-sm"
style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
```

### Input Fields
```jsx
// Unfocused
className="border-2 border-gray-200 focus:border-red-600"

// Focused
className="border-2 border-red-600"

// Error
className="border-2 border-red-600"
```

### Buttons
```jsx
// Primary (Submit) - RED
className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"

// Secondary
className="w-full py-2.5 border-2 border-gray-200 rounded-lg font-medium text-gray-700"

// Toggle Link - RED
className="font-semibold text-red-600 hover:text-red-700"
```

---

## 🔄 State Management

### AuthContext Provides:
```javascript
{
  isAuthModalOpen: boolean,
  openAuthModal: () => void,
  closeAuthModal: () => void
}
```

### Usage in Components:
```jsx
const {
  isAuthModalOpen,
  openAuthModal,
  closeAuthModal
} = useAuth();
```

---

## ✅ Validation Rules

### Email
- Must be valid email format
- Example: `user@example.com`

### Password
- Minimum 6 characters
- No special requirements (can be customized)

### Full Name
- Minimum 2 characters
- Can be first and last name

### Confirm Password
- Must match the password field exactly
- Real-time comparison validation

---

## 🎬 Animation Timings

### Modal Open/Close
```javascript
duration: 0.2s - 0.3s
type: "spring"
damping: 20
stiffness: 300
```

### Form Switch
```javascript
duration: 0.2s - 0.3s
direction: horizontal
type: "spring"
damping: 25
stiffness: 300
```

---

## 📱 Responsive Sizes

| Screen | Modal | Padding |
|--------|-------|---------|
| Mobile | Full-width | 16px |
| Tablet | max-w-md | 24px |
| Desktop | max-w-md | 32px |

---

## 🔧 Customization Examples

### Change Red Color
Search for `#E31E2E` or `red-600` and replace:
```jsx
// Old
className="bg-red-600 hover:bg-red-700"

// New
className="bg-blue-600 hover:bg-blue-700"
```

### Change Validation Rules
Edit `src/utils/validationSchemas.js`:
```javascript
export const loginSchema = z.object({
  email: z.string().email("Custom error message"),
  password: z.string().min(8, "Password must be 8+ chars"), // Changed from 6
});
```

### Add New Form Field
1. Add field to schema in `validationSchemas.js`
2. Add input in form component
3. Register with React Hook Form
4. Add validation error display

### Change Modal Size
Edit `AuthModal.jsx`:
```jsx
className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" // Changed from max-w-md
```

### Disable Social Login Buttons
In `AuthModal.jsx`, comment out or remove:
```jsx
{/* Social Buttons Section */}
```

---

## 🔐 Security Considerations

### Current Implementation
- ✅ Client-side validation with Zod
- ✅ Password fields use `type="password"`
- ✅ Forms clear on submit (if configured)

### Before Going to Production
- [ ] Add CSRF protection
- [ ] Use HTTPS only
- [ ] Hash passwords on backend
- [ ] Implement rate limiting
- [ ] Add JWT token management
- [ ] Use secure HTTP-only cookies
- [ ] Add 2FA support
- [ ] Implement email verification

---

## 🐛 Common Issues & Solutions

### Issue: Modal appears behind other elements
**Solution:** Check z-index values:
```jsx
backdrop: z-40
modal: z-50
```

### Issue: Form fields don't show errors
**Solution:** Ensure error display code exists:
```jsx
{errors.email && (
  <span className="text-sm text-red-600 mt-1 block">
    {errors.email.message}
  </span>
)}
```

### Issue: Submit button not working
**Solution:** Verify form submission handler:
```jsx
const onSubmit = (data) => {
  console.log(data); // Should log form data
};
```

### Issue: Animations are choppy
**Solution:** Check browser performance, consider reducing animation complexity.

---

## 📦 Exported Components

### AuthContext.jsx
```javascript
export { AuthProvider, useAuth }
```

### AuthModal.jsx
```javascript
export default AuthModal
```

### LoginForm.jsx
```javascript
export default LoginForm
```

### SignupForm.jsx
```javascript
export default SignupForm
```

### validationSchemas.js
```javascript
export { loginSchema, signupSchema }
```

---

## 🚀 Performance Tips

1. **Memoize Forms** (optional):
   ```jsx
   export default React.memo(LoginForm);
   ```

2. **Lazy Load Modal**:
   ```jsx
   const AuthModal = lazy(() => import("./auth/AuthModal"));
   ```

3. **Debounce Validation** (if needed):
   ```jsx
   const debouncedValidation = debounce(validate, 300);
   ```

---

## 📚 File Sizes (Approximate)

| File | Size |
|------|------|
| AuthContext.jsx | ~0.5 KB |
| AuthModal.jsx | ~3 KB |
| LoginForm.jsx | ~2 KB |
| SignupForm.jsx | ~2.5 KB |
| validationSchemas.js | ~0.7 KB |
| **Total** | **~8.7 KB** |

---

## 🔗 Related Documentation

- [Complete Authentication Guide](./AUTHENTICATION_GUIDE.md)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Validation Docs](https://zod.dev/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

---

## 💡 Pro Tips

1. **Test Forms**: Use browser devtools to inspect form data
2. **Debug Validation**: Add `console.log(errors)` to see validation state
3. **Customize Animations**: Adjust spring values for different feels
4. **Reuse Components**: AuthModal can be used in multiple pages
5. **Add Loading States**: Show spinner on submit button during API call

---

**Ready to use! Happy coding! 🎉**
