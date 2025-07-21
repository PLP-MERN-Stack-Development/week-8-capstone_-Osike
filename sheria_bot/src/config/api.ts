// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    CHAT: '/api/chat',
    CONSTITUTION: '/api/constitution',
    LEGAL_AID: '/api/legal-aid',
    FAQS: '/api/faqs',
    ANALYTICS: '/api/analytics',
  },
  TIMEOUT: 30000, // 30 seconds
};

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'SheriaBot',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENVIRONMENT: import.meta.env.VITE_NODE_ENV || 'development',
  FEATURES: {
    ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    ERROR_TRACKING: import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true',
  },
};

// Create API client
export const createApiClient = () => {
  const baseURL = API_CONFIG.BASE_URL;
  
  return {
    get: async (endpoint: string) => {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return response.json();
    },
    
    post: async (endpoint: string, data: any) => {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return response.json();
    },
  };
};