// Configuration for the application

// Set this to true for the read-only demo
export const IS_DEMO_MODE = true;

// API configuration
export const API_CONFIG = {
  baseUrl: IS_DEMO_MODE ? '' : 'http://localhost:3001/api',
  timeout: 10000,
};

// Feature flags
export const FEATURES = {
  // Disable editing features in demo mode
  allowEditing: !IS_DEMO_MODE,
  allowDeleting: !IS_DEMO_MODE,
  allowCreating: !IS_DEMO_MODE,
  
  // Show demo mode indicator
  showDemoIndicator: IS_DEMO_MODE,
};

export default {
  IS_DEMO_MODE,
  API_CONFIG,
  FEATURES,
}; 