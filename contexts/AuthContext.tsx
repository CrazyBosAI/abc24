import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: 'Basic' | 'Pro' | 'Premium';
  memberSince: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: { firstName: string; lastName: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: '@3commas_user',
  AUTH_TOKEN: '@3commas_auth_token',
};

// Mock user database for demo purposes
const mockUsers: { [email: string]: { password: string; user: User } } = {
  'demo@3commas.io': {
    password: 'demo123',
    user: {
      id: '1',
      email: 'demo@3commas.io',
      firstName: 'Demo',
      lastName: 'User',
      accountType: 'Pro',
      memberSince: '2024-01-01',
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log('Checking auth state...');
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('Found stored user:', parsedUser.email);
        setUser(parsedUser);
      } else {
        console.log('No stored user found');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const storeCredentials = async (email: string, password: string) => {
    try {
      if (Platform.OS !== 'web') {
        await Keychain.setInternetCredentials('3commas', email, password);
      }
    } catch (error) {
      console.error('Error storing credentials:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      
      // Check mock users first
      const mockUser = mockUsers[email];
      if (mockUser && mockUser.password === password) {
        console.log('Mock user login successful');
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser.user));
        await storeCredentials(email, password);
        setUser(mockUser.user);
        return true;
      }

      // For demo purposes, accept any email/password combination
      // In a real app, this would make an API call to your backend
      if (email.includes('@') && password.length >= 6) {
        const newUser: User = {
          id: Date.now().toString(),
          email,
          firstName: email.split('@')[0].split('.')[0] || 'User',
          lastName: email.split('@')[0].split('.')[1] || '',
          accountType: 'Basic',
          memberSince: new Date().toISOString().split('T')[0],
        };

        console.log('Demo login successful for:', email);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
        await storeCredentials(email, password);
        setUser(newUser);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    userData: { firstName: string; lastName: string }
  ): Promise<boolean> => {
    try {
      console.log('Attempting signup for:', email);
      
      // Check if user already exists in mock database
      if (mockUsers[email]) {
        console.log('User already exists');
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        accountType: 'Basic',
        memberSince: new Date().toISOString().split('T')[0],
      };

      console.log('Signup successful for:', email);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      await storeCredentials(email, password);
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('Logging out user');
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      
      if (Platform.OS !== 'web') {
        await Keychain.resetInternetCredentials('3commas');
      }
      
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (!user) return;
      
      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log('User updated successfully');
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}