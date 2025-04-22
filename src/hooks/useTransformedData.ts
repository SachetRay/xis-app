import { useState, useEffect } from 'react';
import { TransformedUserData } from '../types/transformedUserData';
import { transformUserData, storeTransformedData, getTransformedData } from '../utils/userDataTransformer';
import { userData } from '../data/userData';

export const useTransformedData = () => {
  const [transformedData, setTransformedData] = useState<TransformedUserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to get cached data first
        let data = getTransformedData();
        
        if (!data) {
          // If no cached data, transform and store
          data = transformUserData(userData);
          storeTransformedData(data);
        }
        
        setTransformedData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to transform data');
        console.error('Error transforming data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshData = () => {
    setLoading(true);
    const data = transformUserData(userData);
    storeTransformedData(data);
    setTransformedData(data);
    setLoading(false);
  };

  return {
    transformedData,
    error,
    loading,
    refreshData
  };
}; 