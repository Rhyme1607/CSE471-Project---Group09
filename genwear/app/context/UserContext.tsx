'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  phone: string;
  address: string;
  birthdate: string;
  bio: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS = [
  {
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
    phone: '+1 (555) 123-4567',
    address: '123 Sports Street, Athletic City, 12345',
    birthdate: '1990-01-01',
    bio: 'Passionate about sports and athletic wear. Always looking for the next great workout gear!'
  }
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Omit password from user data before setting state
      const { password: _, ...userData } = foundUser;
      setUser(userData);
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      return false;
    }

    // Create new user with default profile data
    const newUser = {
      email,
      password,
      name,
      phone: '',
      address: '',
      birthdate: '',
      bio: ''
    };

    // Add new user to mock database
    MOCK_USERS.push(newUser);
    
    // Omit password from user data before setting state
    const { password: _, ...userData } = newUser;
    setUser(userData);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 