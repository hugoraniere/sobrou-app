
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type User = {
  id: string;
  email: string;
  fullName: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in (from localStorage in this example)
  useEffect(() => {
    const storedUser = localStorage.getItem('financebot_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    
    // Handle routing based on auth state
    handleInitialRouting();
  }, []);

  // Handle routing when authentication state changes
  useEffect(() => {
    handleProtectedRoutes();
  }, [location.pathname, isAuthenticated]);

  const handleInitialRouting = () => {
    // Initial routing logic when app first loads
    const storedUser = localStorage.getItem('financebot_user');
    const isAuth = !!storedUser;
    
    // If logged in and trying to access auth pages, redirect to dashboard
    if (isAuth && (location.pathname === '/auth')) {
      navigate('/');
    }
  };
  
  const handleProtectedRoutes = () => {
    // Don't redirect during initial load
    if (location.key === 'default') return;
    
    // Redirect unauthenticated users trying to access protected routes
    const protectedRoutes = ['/', '/integration'];
    const authRoutes = ['/auth'];
    const currentPath = location.pathname;
    
    if (!isAuthenticated && protectedRoutes.includes(currentPath)) {
      navigate('/auth');
    }
    
    if (isAuthenticated && authRoutes.includes(currentPath)) {
      navigate('/');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call for login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user (in a real app, this would come from your backend)
      const mockUser = {
        id: '123456',
        email,
        fullName: 'Demo User'
      };
      
      // Store user in localStorage
      localStorage.setItem('financebot_user', JSON.stringify(mockUser));
      
      // Update state
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Redirect to dashboard
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const signup = async (fullName: string, email: string, password: string) => {
    try {
      // Simulate API call for signup
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        fullName
      };
      
      // Store user in localStorage
      localStorage.setItem('financebot_user', JSON.stringify(newUser));
      
      // Update state
      setUser(newUser);
      setIsAuthenticated(true);
      
      // Redirect to dashboard
      navigate('/');
    } catch (error) {
      console.error('Signup failed:', error);
      throw new Error('Signup failed. Please try again.');
    }
  };

  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem('financebot_user');
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to landing page
    navigate('/auth');
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
