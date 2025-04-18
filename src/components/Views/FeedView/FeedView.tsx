import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  alpha,
  useTheme,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface ActivityItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
}

const sampleActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'success',
    title: 'Data Processing Completed',
    description: 'Successfully processed 1,234 records',
    timestamp: '2024-03-20T10:00:00',
    user: {
      name: 'John Doe',
      avatar: 'JD',
    },
  },
  {
    id: '2',
    type: 'error',
    title: 'API Connection Failed',
    description: 'Unable to connect to external service',
    timestamp: '2024-03-20T09:45:00',
    user: {
      name: 'Jane Smith',
      avatar: 'JS',
    },
  },
  {
    id: '3',
    type: 'warning',
    title: 'High Memory Usage',
    description: 'System memory usage above 80%',
    timestamp: '2024-03-20T09:30:00',
    user: {
      name: 'Mike Johnson',
      avatar: 'MJ',
    },
  },
  {
    id: '4',
    type: 'info',
    title: 'New Feature Deployed',
    description: 'Version 2.1.0 has been deployed',
    timestamp: '2024-03-20T09:15:00',
    user: {
      name: 'Sarah Wilson',
      avatar: 'SW',
    },
  },
];

const FeedView: React.FC = () => {
  const theme = useTheme();
  const [activities, setActivities] = useState<ActivityItem[]>(sampleActivities);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      case 'error':
        return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'info':
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
      default:
        return null;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const renderActivityItem = (activity: ActivityItem) => (
    <ListItem
      key={activity.id}
      sx={{
        borderRadius: '8px',
        mb: 1,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
        },
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: alpha(getActivityColor(activity.type), 0.1), color: getActivityColor(activity.type) }}>
          {activity.user.avatar}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: alpha('#000', 0.8) }}>
              {activity.title}
            </Typography>
            {getActivityIcon(activity.type)}
          </Box>
        }
        secondary={
          <Box>
            <Typography variant="body2" sx={{ color: alpha('#000', 0.6), mb: 0.5 }}>
              {activity.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: alpha('#000', 0.5) }}>
                {new Date(activity.timestamp).toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: alpha('#000', 0.5) }}>
                •
              </Typography>
              <Typography variant="caption" sx={{ color: alpha('#000', 0.5) }}>
                {activity.user.name}
              </Typography>
            </Box>
          </Box>
        }
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" size="small">
          <MoreVertIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      p: '24px',
      gap: 3
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 600,
            color: alpha('#000', 0.8),
            mb: 1
          }}>
            Activity Feed
          </Typography>
          <Typography variant="body1" sx={{ 
            color: alpha('#000', 0.6),
            fontSize: '0.875rem'
          }}>
            Real-time updates and notifications
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              borderColor: alpha(theme.palette.divider, 0.1),
              color: alpha('#000', 0.8),
              '&:hover': {
                borderColor: alpha(theme.palette.primary.main, 0.3),
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              }
            }}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              borderColor: alpha(theme.palette.divider, 0.1),
              color: alpha('#000', 0.8),
              '&:hover': {
                borderColor: alpha(theme.palette.primary.main, 0.3),
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              }
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Activity List */}
      <Paper
        sx={{
          p: 2,
          borderRadius: '12px',
          boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.08),
          flex: 1,
          overflow: 'auto',
        }}
      >
        <List>
          {activities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              {renderActivityItem(activity)}
              {index < activities.length - 1 && (
                <Divider sx={{ my: 1 }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default FeedView; 