import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Paper, Box, Typography, useTheme, alpha } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ShieldIcon from '@mui/icons-material/Shield';
import StorageIcon from '@mui/icons-material/Storage';

const SettingsSideNav: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: 'General Settings',
      icon: <SettingsIcon />,
      path: '/settings/general',
    },
    {
      text: 'XDM Path Mapping',
      icon: <DataObjectIcon />,
      path: '/settings/xdm-mapping',
    },
    {
      text: 'Security & Access',
      icon: <ShieldIcon />,
      path: '/settings/security',
    },
    {
      text: 'Data Storage',
      icon: <StorageIcon />,
      path: '/settings/storage',
    },
  ];

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        width: '100%', 
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Box 
        sx={{ 
          py: 2, 
          px: 2, 
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` 
        }}
      >
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 600,
            color: alpha(theme.palette.text.primary, 0.8),
          }}
        >
          Settings
        </Typography>
      </Box>
      <List sx={{ py: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 0,
                py: 1.5,
                px: 2,
                backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                borderLeft: isSelected ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
                textAlign: 'left',
                justifyContent: 'flex-start'
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: isSelected ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.6),
                  minWidth: 40,
                  mr: 1,
                  justifyContent: 'flex-start'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiTypography-root': {
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '0.9rem',
                    textAlign: 'left'
                  }
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default SettingsSideNav; 