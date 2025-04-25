import React from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { logout, updateUserPreferences } from '@/store/slices/authSlice';
import { User, RootState } from '@/types/store';

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleThemeToggle = () => {
    if (user) {
      dispatch(
        updateUserPreferences({
          ...user.preferences,
          theme: user.preferences.theme === 'light' ? 'dark' : 'light',
        })
      );
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={2}>
        <Typography>Please log in to view your profile.</Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      
      <Box mb={2}>
        <Typography variant="h6">{user.name}</Typography>
        <Typography color="textSecondary">{user.email}</Typography>
        <Typography>Role: {user.role}</Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6" gutterBottom>
          Preferences
        </Typography>
        <Button
          variant="outlined"
          onClick={handleThemeToggle}
          sx={{ mr: 1, mb: 1 }}
        >
          Toggle Theme ({user.preferences.theme})
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            dispatch(
              updateUserPreferences({
                ...user.preferences,
                notifications: !user.preferences.notifications,
              })
            )
          }
          sx={{ mb: 1 }}
        >
          Notifications: {user.preferences.notifications ? 'On' : 'Off'}
        </Button>
      </Box>

      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default UserProfile; 