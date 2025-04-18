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
  Card,
  CardContent,
  CardActions,
  Avatar,
  AvatarGroup,
  Tooltip,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Person as PersonIcon,
  Flag as FlagIcon,
  AccessTime as AccessTimeIcon,
  AttachFile as AttachFileIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignees: string[];
  dueDate: string;
  attachments: number;
  comments: number;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      {
        id: '1',
        title: 'Implement user authentication',
        description: 'Add OAuth2 authentication flow with Google and GitHub',
        priority: 'high',
        assignees: ['John Doe', 'Jane Smith'],
        dueDate: '2024-03-25',
        attachments: 2,
        comments: 5,
      },
      {
        id: '2',
        title: 'Design system documentation',
        description: 'Create comprehensive documentation for the design system',
        priority: 'medium',
        assignees: ['Alice Johnson'],
        dueDate: '2024-03-28',
        attachments: 0,
        comments: 3,
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      {
        id: '3',
        title: 'API integration',
        description: 'Integrate with the new payment gateway API',
        priority: 'high',
        assignees: ['Bob Wilson', 'Carol White'],
        dueDate: '2024-03-23',
        attachments: 4,
        comments: 8,
      },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    tasks: [
      {
        id: '4',
        title: 'Performance optimization',
        description: 'Optimize database queries and caching',
        priority: 'medium',
        assignees: ['David Brown'],
        dueDate: '2024-03-24',
        attachments: 1,
        comments: 2,
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      {
        id: '5',
        title: 'Initial setup',
        description: 'Project setup and configuration',
        priority: 'low',
        assignees: ['John Doe'],
        dueDate: '2024-03-20',
        attachments: 0,
        comments: 1,
      },
    ],
  },
];

const ProjectView: React.FC = () => {
  const theme = useTheme();
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const renderTaskCard = (task: Task) => (
    <Card
      sx={{
        mb: 2,
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
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Chip
            label={task.priority}
            size="small"
            sx={{
              backgroundColor: alpha(getPriorityColor(task.priority), 0.1),
              color: getPriorityColor(task.priority),
              fontWeight: 500,
              '& .MuiChip-label': {
                px: 1.5,
                fontSize: '0.75rem'
              }
            }}
          />
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography variant="subtitle1" sx={{ 
          fontWeight: 600,
          color: alpha('#000', 0.8),
          mb: 1
        }}>
          {task.title}
        </Typography>

        <Typography variant="body2" sx={{ 
          color: alpha('#000', 0.6),
          fontSize: '0.875rem',
          mb: 2
        }}>
          {task.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 16, color: alpha('#000', 0.4) }} />
            <Typography variant="caption" sx={{ color: alpha('#000', 0.6) }}>
              {task.dueDate}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AttachFileIcon sx={{ fontSize: 16, color: alpha('#000', 0.4) }} />
            <Typography variant="caption" sx={{ color: alpha('#000', 0.6) }}>
              {task.attachments}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CommentIcon sx={{ fontSize: 16, color: alpha('#000', 0.4) }} />
            <Typography variant="caption" sx={{ color: alpha('#000', 0.6) }}>
              {task.comments}
            </Typography>
          </Box>
        </Box>

        <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
          {task.assignees.map((assignee, index) => (
            <Tooltip key={index} title={assignee}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: '0.875rem',
                  bgcolor: theme.palette.primary.main,
                }}
              >
                {assignee.split(' ').map(n => n[0]).join('')}
              </Avatar>
            </Tooltip>
          ))}
        </AvatarGroup>
      </CardContent>
    </Card>
  );

  const renderColumn = (column: Column) => (
    <Paper
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.08),
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h6" sx={{ 
          color: alpha('#000', 0.8),
          fontWeight: 600
        }}>
          {column.title}
        </Typography>
        <Chip
          label={column.tasks.length}
          size="small"
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            fontWeight: 500,
            '& .MuiChip-label': {
              px: 1.5,
              fontSize: '0.75rem'
            }
          }}
        />
      </Box>

      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: alpha('#000', 0.08),
          borderRadius: 2,
          '&:hover': { backgroundColor: alpha('#000', 0.15) }
        }
      }}>
        {column.tasks.map((task) => renderTaskCard(task))}
      </Box>

      <Button
        startIcon={<AddIcon />}
        sx={{
          mt: 2,
          textTransform: 'none',
          color: alpha('#000', 0.6),
          '&:hover': {
            backgroundColor: alpha('#000', 0.04),
          }
        }}
      >
        Add Task
      </Button>
    </Paper>
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
            Project Board
          </Typography>
          <Typography variant="body1" sx={{ 
            color: alpha('#000', 0.6),
            fontSize: '0.875rem'
          }}>
            Manage and track project tasks
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search tasks..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: alpha('#fff', 0.8),
                '& fieldset': {
                  borderColor: alpha(theme.palette.divider, 0.1),
                },
                '&:hover fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
                '&.Mui-focused fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: alpha('#000', 0.4) }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleMenuClick}
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
            <MenuItem onClick={handleMenuClose}>All Tasks</MenuItem>
            <MenuItem onClick={handleMenuClose}>My Tasks</MenuItem>
            <MenuItem onClick={handleMenuClose}>High Priority</MenuItem>
            <MenuItem onClick={handleMenuClose}>Overdue</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Kanban Board */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        pb: 2,
        '&::-webkit-scrollbar': { height: 4 },
        '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: alpha('#000', 0.08),
          borderRadius: 2,
          '&:hover': { backgroundColor: alpha('#000', 0.15) }
        }
      }}>
        {columns.map((column) => (
          <Box
            key={column.id}
            sx={{
              minWidth: 320,
              flex: '0 0 320px',
            }}
          >
            {renderColumn(column)}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProjectView; 