import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { TransformedUserData } from '../types/transformedUserData';

interface TransformedDataViewerProps {
  error: Error | string | null;
  loading: boolean;
  transformedData: TransformedUserData | null;
}

export const TransformedDataViewer: React.FC<TransformedDataViewerProps> = ({ error, loading, transformedData }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        <Typography>
          Error loading data: {error instanceof Error ? error.message : error}
        </Typography>
      </Alert>
    );
  }

  if (!transformedData) {
    return (
      <Alert severity="info">
        <Typography>No data available</Typography>
      </Alert>
    );
  }

  return (
    <Box>
      <pre>{JSON.stringify(transformedData, null, 2)}</pre>
    </Box>
  );
}; 