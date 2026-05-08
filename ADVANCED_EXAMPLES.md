# Authentication System - Advanced Examples & Patterns

## 🎯 Real-World Implementation Examples

### Example 1: Handle Form Submission with API Call

**LoginForm.jsx - Update onSubmit:**
```jsx
const onSubmit = async (data) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const { token, user } = await response.json();

    // Store token in localStorage
    localStorage.setItem("authToken", token);
    
    // Store user data (optional)
    localStorage.setItem("user", JSON.stringify(user));

    // Close modal
    const { closeAuthModal } = useAuth();
    closeAuthModal();

    // Redirect or update UI
    window.location.href = "/dashboard";
  } catch (error) {
    console.error("Login error:", error);
    // Show error toast/notification
  }
};
```

---

### Example 2: Implement Loading State

**LoginForm.jsx - Enhanced:**
```jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { loginSchema } from "../../utils/validationSchemas";

const LoginForm = ({ onToggle }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("authToken", token);
        // Close modal and redirect
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email & Password fields... */}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          isLoading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader className="w-5 h-5 animate-spin" />
            Signing in...
          </div>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
```

---

### Example 3: Add Error Toast Notifications

**Create Toast Hook:**
```jsx
// src/hooks/useToast.js
import { useState, useCallback } from "react";

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  return { toasts, addToast };
};
```

**Use in LoginForm:**
```jsx
import { useToast } from "../../hooks/useToast";

const LoginForm = ({ onToggle }) => {
  const { addToast } = useToast();

  const onSubmit = async (data) => {
    try {
      // API call...
      addToast("Login successful!", "success");
    } catch (error) {
      addToast(error.message || "Login failed", "error");
    }
  };

  return (
    // ... form JSX
  );
};
```

---

### Example 4: Auto-Close Modal on Success

**Enhanced AuthModal.jsx:**
```jsx
import { useEffect } from "react";

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  useEffect(() => {
    if (!isAuthModalOpen) {
      // Optionally redirect or perform cleanup
      console.log("Modal closed");
    }
  }, [isAuthModalOpen]);

  // Rest of component...
};
```

---

### Example 5: Persist Auth State

**Create Auth Hook:**
```jsx
// src/hooks/useAuthState.js
import { useEffect, useState } from "react";

export const useAuthState = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }

    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return { isLoggedIn, user, loading, logout };
};
```

**Use in App:**
```jsx
function App() {
  const { isLoggedIn, user, loading } = useAuthState();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <AuthModal />
      <Navbar isLoggedIn={isLoggedIn} user={user} />
      <Home />
    </AuthProvider>
  );
}
```

---

### Example 6: Custom Input Component with State

**Create Reusable Input:**
```jsx
// src/components/auth/FormInput.jsx
import { Mail, Lock, User, CheckCircle } from "lucide-react";

const iconMap = {
  email: Mail,
  password: Lock,
  fullName: User,
  confirmPassword: CheckCircle,
};

export const FormInput = ({ name, type, placeholder, icon, error, ...props }) => {
  const Icon = iconMap[icon] || Mail;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {placeholder}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-lg bg-white transition-all focus:outline-none ${
            error ? "border-red-600" : "border-gray-200 focus:border-red-600"
          }`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-sm text-red-600 mt-1 block">{error.message}</span>
      )}
    </div>
  );
};
```

**Use in Forms:**
```jsx
import { FormInput } from "./FormInput";

const LoginForm = ({ onToggle }) => {
  const { register, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form className="space-y-4">
      <FormInput
        icon="email"
        type="email"
        placeholder="Email"
        {...register("email")}
        error={errors.email}
      />
      <FormInput
        icon="password"
        type="password"
        placeholder="Password"
        {...register("password")}
        error={errors.password}
      />
    </form>
  );
};
```

---

### Example 7: Add Remember Me Feature

**Enhanced LoginForm:**
```jsx
const LoginForm = ({ onToggle }) => {
  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = async (data) => {
    if (rememberMe) {
      localStorage.setItem("rememberEmail", data.email);
    }
    // Submit login...
  };

  useEffect(() => {
    // Auto-fill email if remembered
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setValue("email", savedEmail);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email & Password fields... */}

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300"
        />
        <span className="text-sm text-gray-600">Remember me</span>
      </label>

      {/* Submit button... */}
    </form>
  );
};
```

---

### Example 8: OAuth Integration

**Add OAuth Buttons:**
```jsx
// In AuthModal.jsx, update social buttons section:

const handleGoogleAuth = async () => {
  try {
    // Google OAuth implementation
    const response = await fetch("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ token: googleToken }),
    });
    // Handle response...
  } catch (error) {
    console.error("Google auth failed:", error);
  }
};

<button
  onClick={handleGoogleAuth}
  className="w-full py-2.5 border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:border-gray-300 transition-colors"
>
  Sign in with Google
</button>
```

---

### Example 9: Validate Password Strength

**Enhanced validationSchemas.js:**
```javascript
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain uppercase letter")
  .regex(/[a-z]/, "Password must contain lowercase letter")
  .regex(/[0-9]/, "Password must contain number");

export const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name required"),
    email: z.string().email("Invalid email"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
```

---

### Example 10: Dark Mode Support

**Update AuthModal styles:**
```jsx
<motion.div
  className={`rounded-2xl shadow-2xl w-full max-w-md relative ${
    isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
  }`}
  // ... animations
>
  {/* Rest of modal */}
</motion.div>
```

---

## 🔌 Integration Patterns

### Pattern 1: Protected Routes
```jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isLoggedIn }) => {
  return isLoggedIn ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
```

### Pattern 2: Global Auth Error Handling
```jsx
export const withAuthErrorHandling = (Component) => {
  return (props) => {
    const handleAuthError = (error) => {
      if (error.status === 401) {
        // Redirect to login
      }
    };

    return <Component {...props} onAuthError={handleAuthError} />;
  };
};
```

### Pattern 3: Auto-Logout on Token Expiry
```jsx
export const useTokenRefresh = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          const { token } = await response.json();
          localStorage.setItem("authToken", token);
        } else {
          // Token expired, logout user
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(interval);
  }, []);
};
```

---

## 📊 Testing Examples

### Unit Test - LoginForm
```javascript
// LoginForm.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  it("should display validation errors", async () => {
    render(<LoginForm onToggle={jest.fn()} />);
    
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await userEvent.click(submitButton);

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it("should submit valid data", async () => {
    const { container } = render(<LoginForm onToggle={jest.fn()} />);
    
    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');
    
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert form submission
  });
});
```

---

## 🚀 Deployment Checklist

- [ ] Remove `console.log` statements
- [ ] Set up environment variables
- [ ] Implement rate limiting on backend
- [ ] Enable HTTPS
- [ ] Set up CORS properly
- [ ] Use secure HTTP-only cookies
- [ ] Implement CSRF tokens
- [ ] Add proper error handling
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Set up analytics tracking
- [ ] Create error logging system

---

**Happy coding! 🎉**
