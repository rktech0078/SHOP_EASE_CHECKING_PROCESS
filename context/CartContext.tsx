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
  selectedSize?: string | undefined;
  selectedColor?: string | undefined;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
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
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          // Validate cart items have required product properties
          const validCartItems = parsedCart.filter((item: CartItem) => {
            return item.product && 
                   item.product._id && 
                   item.product.name && 
                   typeof item.product.price === 'number' &&
                   typeof item.quantity === 'number' &&
                   item.quantity > 0;
          });
          
          if (validCartItems.length !== parsedCart.length) {
            console.log('🧹 Removed invalid cart items');
          }
          
          setCartItems(validCartItems);
        } catch (error) {
          console.error('Error parsing saved cart:', error);
          localStorage.removeItem('cart');
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
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
  const addToCart = useCallback((product: Product, quantity: number = 1, selectedSize?: string, selectedColor?: string) => {
    if (!product || !product._id || quantity <= 0) {
      console.error('Invalid product or quantity');
      return;
    }

    setCartItems(prevItems => {
      // Check for existing item with same product, size, and color
      const existingItem = prevItems.find(item => 
        item.product._id === product._id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
      );
      
      if (existingItem) {
        // Update existing item quantity
        return prevItems.map(item =>
          item.product._id === product._id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = { 
          product, 
          quantity, 
          selectedSize: selectedSize, 
          selectedColor: selectedColor 
        };
        return [...prevItems, newItem];
      }
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId: string, selectedSize?: string, selectedColor?: string) => {
    setCartItems(prevItems => prevItems.filter(item => {
      // If size/color specified, only remove exact match
      if (selectedSize || selectedColor) {
        return !(item.product._id === productId && 
                item.selectedSize === selectedSize && 
                item.selectedColor === selectedColor);
      }
      // Otherwise remove all items with this product ID
      return item.product._id !== productId;
    }));
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
    localStorage.removeItem('cart');
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