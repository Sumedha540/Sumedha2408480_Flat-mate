/**
 * API Configuration
 * Centralized configuration for backend API URL
 * Uses environment variable VITE_BACKEND_URL if available, otherwise defaults to localhost
 */

// Get backend URL from environment variables or use default
export const getBackendURL = (): string => {
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
};

// Export for direct usage
export const BACKEND_URL = getBackendURL();