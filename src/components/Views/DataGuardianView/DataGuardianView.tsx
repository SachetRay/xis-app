import React from 'react';
import { Box, Typography, alpha } from '@mui/material';

const DataGuardianView: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Data Guardian
      </Typography>
      <Typography variant="body1" sx={{ color: alpha('#000', 0.6) }}>
        Coming soon...
      </Typography>
    </Box>
  );
};

export default DataGuardianView; 