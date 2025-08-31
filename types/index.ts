import { PortableTextBlock } from '@portabletext/types';

// Product Type
export interface Product {
  category: any;
  _id: string;
  _createdAt: string;
  name: string;
  slug: {
    current: string;
  };
  images: {
    asset: {
      _ref: string;
    };
  }[];
  categories: {
    _id: string;
    slug: {
      current: string;
    };
    name: string;
    _ref: string;
  }[];
  price: number;
  discount?: number;
  description: string;
  features?: string[];
  inStock: boolean;
  featured: boolean;
}

// Category Type
export interface Category {
  _id: string;
  _createdAt: string;
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  image?: {
    asset: {
      _ref: string;
    };
  };
}

// Banner Type
export interface Banner {
  _id: string;
  _createdAt: string;
  title: string;
  subtitle?: string;
  // Desktop Banner (1920x600px recommended)
  image?: {
    asset: {
      _ref: string;
    };
  };
  // Mobile Banner (750x1000px recommended)
  mobileImage?: {
    asset: {
      _ref: string;
    };
  };
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
}

// Order Item Type
export interface OrderItem {
  name: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount?: number;
  finalPrice: number;
  productImage?: {
    asset: {
      _ref: string;
    };
  };
}

// Customer Information Type
export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

// Order Type
export interface Order {
  _id?: string;
  _createdAt?: string;
  orderId: string;
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'credit_card' | 'cod' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  notes?: string;
}

// User Type
export interface User {
  _id: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  role: 'customer' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}