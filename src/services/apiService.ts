import { IS_DEMO_MODE, API_CONFIG } from '../config/config';
import mockApiService from './mockDataService';

// API service that uses either real API or mock data based on configuration
const apiService = {
  // Get user data
  getUserData: async () => {
    if (IS_DEMO_MODE) {
      return mockApiService.getUserData();
    }
    
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  },
  
  // Get attributes
  getAttributes: async () => {
    if (IS_DEMO_MODE) {
      return mockApiService.getAttributes();
    }
    
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/attributes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch attributes');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching attributes:', error);
      throw error;
    }
  },
  
  // Get attribute details
  getAttributeDetails: async (id: string) => {
    if (IS_DEMO_MODE) {
      return mockApiService.getAttributeDetails(id);
    }
    
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/attributes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch attribute details');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching attribute details:', error);
      throw error;
    }
  },
  
  // Get analytics data
  getAnalyticsData: async () => {
    if (IS_DEMO_MODE) {
      return mockApiService.getAnalyticsData();
    }
    
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  },
};

export default apiService; 