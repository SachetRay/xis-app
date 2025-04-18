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
  LinearProgress,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'completed' | 'not-started';
  dueDate: string;
  assignees: string[];
}

const sampleGoals: Goal[] = [
  {
    id: '1',
    title: 'Increase User Engagement',
    description: 'Improve user engagement metrics by 25% through new features and UI improvements',
    progress: 75,
    status: 'on-track',
    dueDate: '2024-06-30',
    assignees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
  },
  {
    id: '2',
    title: 'Launch Mobile App',
    description: 'Complete development and launch the mobile application for iOS and Android',
    progress: 45,
    status: 'at-risk',
    dueDate: '2024-07-15',
    assignees: ['Sarah Wilson', 'Tom Brown'],
  },
  {
    id: '3',
    title: 'Reduce Server Response Time',
    description: 'Optimize server performance to achieve < 100ms response time',
    progress: 100,
    status: 'completed',
    dueDate: '2024-05-01',
    assignees: ['Alex Chen'],
  },
  {
    id: '4',
    title: 'Implement Analytics Dashboard',
    description: 'Create a comprehensive analytics dashboard for tracking KPIs',
    progress: 0,
    status: 'not-started',
    dueDate: '2024-08-01',
    assignees: ['Emily Davis', 'Chris Lee'],
  },
];

const GoalsView: React.FC = () => {
  const theme = useTheme();
  const [goals, setGoals] = useState<Goal[]>(sampleGoals);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, goalId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedGoal(goalId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGoal(null);
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'on-track':
        return theme.palette.success.main;
      case 'at-risk':
        return theme.palette.warning.main;
      case 'completed':
        return theme.palette.info.main;
      case 'not-started':
        return theme.palette.grey[500];
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'on-track':
        return <CheckCircleIcon />;
      case 'at-risk':
        return <WarningIcon />;
      case 'completed':
        return <FlagIcon />;
      case 'not-started':
        return <ScheduleIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const renderGoal = (goal: Goal) => (
    <Grid item xs={12} key={goal.id}>
      <Paper
        sx={{
          p: 3,
          borderRadius: '12px',
          boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.08),
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 20px ${alpha('#000', 0.08)}`,
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2
        }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6" sx={{ 
                fontSize: '1.1rem',
                fontWeight: 600,
                color: alpha('#000', 0.8)
              }}>
                {goal.title}
              </Typography>
              <Chip
                icon={getStatusIcon(goal.status)}
                label={goal.status.replace('-', ' ')}
                size="small"
                sx={{
                  backgroundColor: alpha(getStatusColor(goal.status), 0.1),
                  color: getStatusColor(goal.status),
                  fontWeight: 500,
                  '& .MuiChip-icon': {
                    color: 'inherit',
                  }
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ 
              color: alpha('#000', 0.6),
              mb: 2
            }}>
              {goal.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: alpha('#000', 0.6) }}>
                    Progress
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: alpha('#000', 0.8),
                    fontWeight: 500
                  }}>
                    {goal.progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={goal.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundColor: getStatusColor(goal.status),
                    }
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ color: alpha('#000', 0.6) }}>
                  Due: {new Date(goal.dueDate).toLocaleDateString()}
                </Typography>
                <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
                  {goal.assignees.map((assignee, index) => (
                    <Avatar key={index} sx={{ bgcolor: theme.palette.primary.main }}>
                      <PersonIcon sx={{ fontSize: 14 }} />
                    </Avatar>
                  ))}
                </AvatarGroup>
              </Box>
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, goal.id)}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Grid>
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
            Goals
          </Typography>
          <Typography variant="body1" sx={{ 
            color: alpha('#000', 0.6),
            fontSize: '0.875rem'
          }}>
            Track and manage your project goals
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            }
          }}
        >
          Add Goal
        </Button>
      </Box>

      {/* Goals Grid */}
      <Grid container spacing={3}>
        {goals.map(renderGoal)}
      </Grid>

      {/* Goal Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '8px',
            boxShadow: `0 4px 20px ${alpha('#000', 0.08)}`,
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Goal</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Goal</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default GoalsView; 