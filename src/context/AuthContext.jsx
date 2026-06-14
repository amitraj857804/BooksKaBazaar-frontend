import { createContext, useContext, useState, useEffect } from "react";
import { userApi } from "../services/user/userApi";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "signup"
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    const storedToken = localStorage.getItem("userToken");
    if (storedUser && storedToken) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Error parsing stored user data", e);
      }
    }
    return null;
  });

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    try {
      const profileData = await userApi.getProfile();
      if (profileData) {
        const mappedUser = {
          userId: profileData.userId,
          fullName: profileData.fullName,
          email: profileData.emailId || profileData.email || "",
          phone: profileData.phoneNumber || profileData.phone || "",
          address: profileData.address || "",
          city: profileData.city || "",
          state: profileData.state || "",
          pincode: profileData.pincode || "",
        };
        localStorage.setItem("userData", JSON.stringify(mappedUser));
        setUser(mappedUser);
        return mappedUser;
      }
    } catch (e) {
      console.error("Error fetching user profile", e);
      if (e.response?.status === 401) {
        logoutUser();
      }
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    if (storedToken) {
      fetchUserProfile();
    }
  }, []);

  const openAuthModal = (mode = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginUser = (userData, token) => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
    closeAuthModal();
    // Fetch full profile info right after setting token
    fetchUserProfile();
  };

  const logoutUser = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  const updateUser = async (newUserData) => {
    const mergedData = { ...user, ...newUserData };
    const requestBody = {
      fullName: mergedData.fullName,
      emailId: mergedData.email || mergedData.emailId,
      phoneNumber: mergedData.phone || mergedData.phoneNumber,
      address: mergedData.address,
      city: mergedData.city,
      state: mergedData.state,
      pincode: mergedData.pincode,
    };
    await userApi.updateProfile(requestBody);
    const freshUserData = await fetchUserProfile();
    return freshUserData;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authMode,
        setAuthMode,
        user,
        loginUser,
        logoutUser,
        updateUser,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
