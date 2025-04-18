// Mock data service for read-only demo
// This file replaces actual API calls with static data

import { userData } from '../data/userData';

// Mock API response delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API endpoints
export const mockApiService = {
  // Get user data
  getUserData: async () => {
    await delay(500); // Simulate network delay
    return { data: userData };
  },
  
  // Get attributes
  getAttributes: async () => {
    await delay(500);
    return {
      data: [
        { id: 1, name: 'Customer ID', type: 'string', description: 'Unique identifier for the customer' },
        { id: 2, name: 'Purchase Date', type: 'date', description: 'Date when the purchase was made' },
        { id: 3, name: 'Product Category', type: 'string', description: 'Category of the purchased product' },
        { id: 4, name: 'Transaction Amount', type: 'number', description: 'Amount of the transaction' },
        { id: 5, name: 'Customer Segment', type: 'string', description: 'Segment the customer belongs to' },
      ]
    };
  },
  
  // Get attribute details
  getAttributeDetails: async (id: string) => {
    await delay(500);
    return {
      data: {
        id: parseInt(id),
        name: 'Customer Segment',
        type: 'string',
        description: 'Segment the customer belongs to',
        usage: {
          total: 1250,
          bySource: [
            { source: 'CRM', count: 800 },
            { source: 'Website', count: 300 },
            { source: 'Mobile App', count: 150 }
          ]
        },
        values: [
          { value: 'Premium', count: 450 },
          { value: 'Standard', count: 650 },
          { value: 'Basic', count: 150 }
        ]
      }
    };
  },
  
  // Get analytics data
  getAnalyticsData: async () => {
    await delay(500);
    return {
      data: {
        totalUsers: 12500,
        activeUsers: 8750,
        newUsers: 320,
        retentionRate: 0.78,
        dailyActiveUsers: [120, 150, 180, 200, 220, 250, 280],
        userSegments: [
          { name: 'Premium', count: 4500 },
          { name: 'Standard', count: 6500 },
          { name: 'Basic', count: 1500 }
        ]
      }
    };
  }
};

export default mockApiService; 