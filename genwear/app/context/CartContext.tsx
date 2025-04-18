'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';

// Define types for cart items
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

// Define the context type
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user, token, isAuthenticated } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  
  // Watch for authentication changes and clear cart when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
    }
  }, [isAuthenticated]);
  
  // Load cart from localStorage or database on initial render
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      
      if (isAuthenticated && token) {
        try {
          // Fetch cart from database
          const response = await fetch('/api/cart', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setItems(data.cart || []);
          } else {
            console.error('Failed to fetch cart from database');
            // Fallback to localStorage
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
              try {
                setItems(JSON.parse(savedCart));
              } catch (error) {
                console.error('Error parsing cart from localStorage:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
          // Fallback to localStorage
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            try {
              setItems(JSON.parse(savedCart));
            } catch (error) {
              console.error('Error parsing cart from localStorage:', error);
            }
          }
        }
      } else {
        // Not authenticated, use localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            setItems(JSON.parse(savedCart));
          } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
          }
        }
      }
      
      setIsLoading(false);
    };
    
    loadCart();
  }, [isAuthenticated, token]);
  
  // Save cart to localStorage and database whenever it changes
  useEffect(() => {
    // Skip the first render to avoid unnecessary API calls
    if (isLoading) return;
    
    // Always save to localStorage
    localStorage.setItem('cart', JSON.stringify(items));
    
    // If authenticated, also save to database
    if (isAuthenticated && token) {
      const syncCartWithDatabase = async () => {
        try {
          // Update cart in database
          await fetch('/api/cart', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cart: items })
          });
        } catch (error) {
          console.error('Error syncing cart with database:', error);
        }
      };
      
      syncCartWithDatabase();
    }
  }, [items, isAuthenticated, token, isLoading]);
  
  // Calculate total items
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate total price with 2 decimal places
  const totalPrice = Number(items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2));
  
  // Add item to cart
  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If item doesn't exist, add it with quantity 1
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
  };
  
  // Remove item from cart
  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };
  
  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setItems([]);
  };
  
  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 