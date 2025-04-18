import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  alpha,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  SelectChangeEvent,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Storage as StorageIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    avatar: 'JD',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    avatar: 'JS',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'Viewer',
    avatar: 'MJ',
  },
];

const SettingsView: React.FC = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
  });
  const [themeMode, setThemeMode] = useState('light');
  const [language, setLanguage] = useState('en');
  const [users, setUsers] = useState<User[]>(sampleUsers);

  const handleNotificationChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications({ ...notifications, [name]: event.target.checked });
  };

  const handleThemeChange = (event: SelectChangeEvent) => {
    setThemeMode(event.target.value);
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const renderSection = (title: string, icon: React.ReactNode, content: React.ReactNode) => (
    <Paper
      sx={{
        p: 3,
        borderRadius: '12px',
        boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.08),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '10px',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" sx={{ color: alpha('#000', 0.8), fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      {content}
    </Paper>
  );

  const renderUserItem = (user: User) => (
    <ListItem
      key={user.id}
      sx={{
        borderRadius: '8px',
        mb: 1,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
        },
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
          {user.avatar}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={user.name}
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: alpha('#000', 0.6) }}>
              {user.email}
            </Typography>
            <Chip
              label={user.role}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                height: 20,
                '& .MuiChip-label': {
                  px: 1,
                  fontSize: '0.75rem',
                },
              }}
            />
          </Box>
        }
      />
      <ListItemSecondaryAction>
        <Tooltip title="Edit">
          <IconButton edge="end" sx={{ mr: 1 }}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton edge="end" color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );

  return (
    <Box sx={{ p: '24px', maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, color: alpha('#000', 0.8), fontWeight: 600 }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Notifications Section */}
        <Grid item xs={12} md={6}>
          {renderSection(
            'Notifications',
            <NotificationsIcon />,
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.email}
                    onChange={handleNotificationChange('email')}
                    color="primary"
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.push}
                    onChange={handleNotificationChange('push')}
                    color="primary"
                  />
                }
                label="Push Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.updates}
                    onChange={handleNotificationChange('updates')}
                    color="primary"
                  />
                }
                label="Product Updates"
              />
            </Box>
          )}
        </Grid>

        {/* Appearance Section */}
        <Grid item xs={12} md={6}>
          {renderSection(
            'Appearance',
            <PaletteIcon />,
            <Box>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Theme</InputLabel>
                <Select value={themeMode} onChange={handleThemeChange} label="Theme">
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select value={language} onChange={handleLanguageChange} label="Language">
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </Grid>

        {/* Security Section */}
        <Grid item xs={12} md={6}>
          {renderSection(
            'Security',
            <SecurityIcon />,
            <Box>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                }}
              >
                Update Password
              </Button>
            </Box>
          )}
        </Grid>

        {/* User Management Section */}
        <Grid item xs={12} md={6}>
          {renderSection(
            'User Management',
            <PersonIcon />,
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: alpha('#000', 0.8), fontWeight: 500 }}>
                  Users
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '8px',
                  }}
                >
                  Add User
                </Button>
              </Box>
              <List>
                {users.map(renderUserItem)}
              </List>
            </Box>
          )}
        </Grid>

        {/* Storage Section */}
        <Grid item xs={12}>
          {renderSection(
            'Storage',
            <StorageIcon />,
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: alpha('#000', 0.8), fontWeight: 500, mr: 1 }}>
                  Storage Usage
                </Typography>
                <Tooltip title="This shows your current storage usage">
                  <InfoIcon sx={{ color: alpha('#000', 0.4), fontSize: 20 }} />
                </Tooltip>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: alpha('#000', 0.6), mb: 1 }}>
                  75% of 100GB used
                </Typography>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: '75%',
                      height: '100%',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 4,
                    }}
                  />
                </Box>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                }}
              >
                Upgrade Storage
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsView; 