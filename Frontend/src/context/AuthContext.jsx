import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('civicbuzz_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('civicbuzz_token');
      const storedUser = localStorage.getItem('civicbuzz_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Refresh profile in background
          const freshProfile = await authService.getMe();
          setUser((prev) => ({ ...prev, ...freshProfile }));
          localStorage.setItem('civicbuzz_user', JSON.stringify(freshProfile));
        } catch {
          // Token expired or invalid
          localStorage.removeItem('civicbuzz_token');
          localStorage.removeItem('civicbuzz_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, role = 'citizen') => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password, role);
      localStorage.setItem('civicbuzz_token', data.access_token);
      localStorage.setItem('civicbuzz_user', JSON.stringify(data));
      setToken(data.access_token);
      setUser(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      const data = await authService.register(formData);
      localStorage.setItem('civicbuzz_token', data.access_token);
      localStorage.setItem('civicbuzz_user', JSON.stringify(data));
      setToken(data.access_token);
      setUser(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  };

  const verifyAadhaar = (maskedAadhaar) => {
    if (user) {
      const updated = { ...user, is_aadhaar_verified: true, aadhaar_masked: maskedAadhaar };
      setUser(updated);
      localStorage.setItem('civicbuzz_user', JSON.stringify(updated));
    }
  };

  // Demo Quick-Switch helper for hackathon judging
  const switchDemoRole = async (roleName) => {
    try {
      if (roleName === 'CITIZEN') {
        return await login('citizen@civicbuzz.in', 'Citizen@123', 'citizen');
      } else if (roleName === 'OFFICER') {
        return await login('officer@civicbuzz.in', 'Officer@123', 'officer');
      } else if (roleName === 'ADMIN') {
        return await login('admin@civicbuzz.in', 'Admin@123', 'admin');
      }
    } catch {
      // Instant fallback for demo role switching
      const normalizedRole = roleName.toUpperCase();
      const demoUser = {
        user_id: normalizedRole === 'ADMIN' ? 3 : normalizedRole === 'OFFICER' ? 2 : 1,
        user_uid: `USR-${normalizedRole}-DEMO`,
        email: `${normalizedRole.toLowerCase()}@civicbuzz.in`,
        full_name:
          normalizedRole === 'ADMIN'
            ? 'Municipal Administrator'
            : normalizedRole === 'OFFICER'
            ? 'Ward 12 Road Officer'
            : 'Subham Samal (Citizen)',
        role: normalizedRole,
        is_aadhaar_verified: true,
        aadhaar_masked: 'XXXX-XXXX-8921',
        access_token: `mock_jwt_${normalizedRole.toLowerCase()}_token`,
        refresh_token: `mock_refresh_${normalizedRole.toLowerCase()}_token`,
      };
      localStorage.setItem('civicbuzz_token', demoUser.access_token);
      localStorage.setItem('civicbuzz_user', JSON.stringify(demoUser));
      setToken(demoUser.access_token);
      setUser(demoUser);
      return demoUser;
    }
  };

  const userRole = String(user?.role || '').toUpperCase();

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        verifyAadhaar,
        switchDemoRole,
        isCitizen: userRole === 'CITIZEN' || !user,
        isOfficer: userRole === 'OFFICER' || userRole === 'DEPARTMENT_HEAD',
        isAdmin: userRole === 'ADMIN' || userRole === 'SUPER_ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
