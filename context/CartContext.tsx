'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  images: Array<{ asset: { _ref: string } }>;
  inStock: boolean;
  slug?: { current: string };
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shopEaseCart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          // Validate cart data structure
          const validCart = parsedCart.filter(item => 
            item && 
            item.product && 
            item.product._id && 
            item.product.name && 
            typeof item.product.price === 'number' &&
            typeof item.quantity === 'number' &&
            item.quantity > 0
          );
          setCartItems(validCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // Clear invalid cart data
      localStorage.removeItem('shopEaseCart');
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('shopEaseCart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartItems, isInitialized]);

  // Calculate cart totals
  const calculateTotals = useCallback(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const itemPrice = item.product.discount
        ? item.product.price - (item.product.price * item.product.discount / 100)
        : item.product.price;
      return sum + (itemPrice * item.quantity);
    }, 0);

    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal >= 1000 ? 0 : 200; // Free shipping over Rs 1000, otherwise Rs 200
    const discount = 0; // Can be implemented later with coupon codes

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping,
      discount,
      totalPrice: Math.round((subtotal + tax + shipping - discount) * 100) / 100
    };
  }, [cartItems]);

  const { subtotal, tax, shipping, discount, totalPrice } = calculateTotals();

  // Add item to cart
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    if (!product || !product._id || quantity <= 0) {
      console.error('Invalid product or quantity');
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product._id === product._id);
      
      if (existingItem) {
        // Update existing item quantity
        return prevItems.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { product, quantity }];
      }
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId: string) => {
    if (!productId) return;
    
    setCartItems(prevItems => 
      prevItems.filter(item => item.product._id !== productId)
    );
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!productId || quantity <= 0) return;
    
    setCartItems(prevItems => 
      prevItems.map(item =>
        item.product._id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('shopEaseCart');
  }, []);

  // Get total number of items
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    tax,
    shipping,
    discount,
    totalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};