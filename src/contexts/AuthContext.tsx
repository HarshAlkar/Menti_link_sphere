import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  profile_image?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (formData: FormData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user data on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Mock users for demo
      const mockUsers: User[] = [
        { id: '1', username: 'student', email: 'student@example.com', role: 'student' },
        { id: '2', username: 'mentor', email: 'mentor@example.com', role: 'mentor' },
        { id: '3', username: 'teacher', email: 'teacher@example.com', role: 'teacher' },
        { id: '4', username: 'HARSH', email: 'harsh@example.com', role: 'student' },
      ];

      const mockUser = mockUsers.find(u => u.username === username);
      
      if (mockUser && password === '12345678') {
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (formData: FormData): Promise<boolean> => {
    try {
      const username = formData.get('username') as string;
      const email = formData.get('email') as string;
      const role = formData.get('role') as string;
      const profileImage = formData.get('profile_image') as File | null;

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        role,
        profile_image: profileImage ? URL.createObjectURL(profileImage) : undefined,
      };

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
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
