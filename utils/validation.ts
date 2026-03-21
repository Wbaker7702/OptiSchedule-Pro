// Input validation utilities

import sanitizeHtml from 'sanitize-html';

export const validators = {
  // Name validation
  name: (value: string): { valid: boolean; error?: string } => {
    if (!value || !value.trim()) {
      return { valid: false, error: 'Name is required' };
    }
    if (value.trim().length < 2) {
      return { valid: false, error: 'Name must be at least 2 characters' };
    }
    if (value.trim().length > 100) {
      return { valid: false, error: 'Name must not exceed 100 characters' };
    }
    // Only allow letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s\-']+$/.test(value.trim())) {
      return { valid: false, error: 'Name contains invalid characters' };
    }
    return { valid: true };
  },

  // Email validation
  email: (value: string): { valid: boolean; error?: string } => {
    if (!value || !value.trim()) {
      return { valid: false, error: 'Email is required' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      return { valid: false, error: 'Invalid email format' };
    }
    if (value.length > 254) {
      return { valid: false, error: 'Email is too long' };
    }
    return { valid: true };
  },

  // Age validation
  age: (value: string | number): { valid: boolean; error?: string } => {
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    
    if (isNaN(num)) {
      return { valid: false, error: 'Age must be a valid number' };
    }
    if (num < 14) {
      return { valid: false, error: 'Minimum age is 14' };
    }
    if (num > 120) {
      return { valid: false, error: 'Age must be realistic (max 120)' };
    }
    return { valid: true };
  },

  // Position/Role validation
  role: (value: string): { valid: boolean; error?: string } => {
    if (!value || !value.trim()) {
      return { valid: false, error: 'Position is required' };
    }
    if (value.trim().length < 2) {
      return { valid: false, error: 'Position must be at least 2 characters' };
    }
    if (value.trim().length > 50) {
      return { valid: false, error: 'Position must not exceed 50 characters' };
    }
    // Allow letters, numbers, spaces, and common characters
    if (!/^[a-zA-Z0-9\s\-/()&]+$/.test(value.trim())) {
      return { valid: false, error: 'Position contains invalid characters' };
    }
    return { valid: true };
  },

  // Text note validation (for reason, notes, etc)
  text: (value: string, minLength = 1, maxLength = 500): { valid: boolean; error?: string } => {
    if (minLength > 0 && (!value || !value.trim())) {
      return { valid: false, error: 'This field is required' };
    }
    if (value && value.trim().length < minLength) {
      return { valid: false, error: `Minimum ${minLength} characters required` };
    }
    if (value && value.trim().length > maxLength) {
      return { valid: false, error: `Maximum ${maxLength} characters allowed` };
    }
    // Prevent XSS by disallowing certain characters
    if (/<|>|javascript:|on\w+\s*=/.test(value)) {
      return { valid: false, error: 'Invalid characters detected' };
    }
    return { valid: true };
  },

  // Numeric quantity validation
  quantity: (value: string | number, min = 0, max = 1000): { valid: boolean; error?: string } => {
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    
    if (isNaN(num)) {
      return { valid: false, error: 'Quantity must be a valid number' };
    }
    if (num < min) {
      return { valid: false, error: `Quantity must be at least ${min}` };
    }
    if (num > max) {
      return { valid: false, error: `Quantity must not exceed ${max}` };
    }
    return { valid: true };
  },

  // Department validation
  department: (value: string): { valid: boolean; error?: string } => {
    const validDepartments = ['Front End', 'Electronics', 'Grocery', 'Pharmacy', 'Apparel'];
    if (!value || !value.trim()) {
      return { valid: false, error: 'Department is required' };
    }
    if (!validDepartments.includes(value)) {
      return { valid: false, error: 'Invalid department' };
    }
    return { valid: true };
  },

  // SKU/Product ID validation
  sku: (value: string): { valid: boolean; error?: string } => {
    if (!value || !value.trim()) {
      return { valid: false, error: 'SKU is required' };
    }
    if (!/^[A-Z0-9\-]+$/.test(value.trim())) {
      return { valid: false, error: 'SKU must contain only uppercase letters, numbers, and hyphens' };
    }
    if (value.length > 50) {
      return { valid: false, error: 'SKU is too long' };
    }
    return { valid: true };
  },
};

export const sanitizeInput = (value: string, maxLength = 500): string => {
  const trimmed = (value || '').trim().slice(0, maxLength);
  return sanitizeHtml(trimmed, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

