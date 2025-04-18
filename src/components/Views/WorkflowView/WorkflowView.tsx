import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  alpha,
  useTheme,
  Chip,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

interface WorkflowStep {
  id: string;
  name: string;
  status: 'completed' | 'running' | 'error' | 'pending' | 'paused';
  progress: number;
  startTime: string;
  endTime?: string;
  description: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'error';
  steps: WorkflowStep[];
  lastRun: string;
  nextRun?: string;
  owner: string;
  icon: string;
}

const sampleWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Data Processing Pipeline',
    description: 'Process and transform raw data into analytics-ready format',
    status: 'active',
    steps: [
      {
        id: '1-1',
        name: 'Data Validation',
        status: 'completed',
        progress: 100,
        startTime: '2024-03-20T10:00:00',
        endTime: '2024-03-20T10:05:00',
        description: 'Validate incoming data format and structure',
      },
      {
        id: '1-2',
        name: 'Data Cleaning',
        status: 'running',
        progress: 65,
        startTime: '2024-03-20T10:05:00',
        description: 'Remove duplicates and handle missing values',
      },
      {
        id: '1-3',
        name: 'Feature Engineering',
        status: 'pending',
        progress: 0,
        startTime: '',
        description: 'Create new features from existing data',
      },
    ],
    lastRun: '2024-03-20T10:00:00',
    nextRun: '2024-03-21T10:00:00',
    owner: 'John Doe',
    icon: '🔄',
  },
  {
    id: '2',
    name: 'Model Training Pipeline',
    description: 'Train and evaluate machine learning models',
    status: 'paused',
    steps: [
      {
        id: '2-1',
        name: 'Data Preparation',
        status: 'completed',
        progress: 100,
        startTime: '2024-03-19T15:00:00',
        endTime: '2024-03-19T15:30:00',
        description: 'Prepare training and validation datasets',
      },
      {
        id: '2-2',
        name: 'Model Training',
        status: 'paused',
        progress: 45,
        startTime: '2024-03-19T15:30:00',
        description: 'Train the model on prepared data',
      },
      {
        id: '2-3',
        name: 'Model Evaluation',
        status: 'pending',
        progress: 0,
        startTime: '',
        description: 'Evaluate model performance metrics',
      },
    ],
    lastRun: '2024-03-19T15:00:00',
    owner: 'Jane Smith',
    icon: '🤖',
  },
  {
    id: '3',
    name: 'Report Generation',
    description: 'Generate and distribute analytics reports',
    status: 'error',
    steps: [
      {
        id: '3-1',
        name: 'Data Aggregation',
        status: 'completed',
        progress: 100,
        startTime: '2024-03-18T09:00:00',
        endTime: '2024-03-18T09:15:00',
        description: 'Aggregate data from multiple sources',
      },
      {
        id: '3-2',
        name: 'Report Generation',
        status: 'error',
        progress: 30,
        startTime: '2024-03-18T09:15:00',
        description: 'Generate PDF reports from aggregated data',
      },
      {
        id: '3-3',
        name: 'Report Distribution',
        status: 'pending',
        progress: 0,
        startTime: '',
        description: 'Send reports to stakeholders',
      },
    ],
    lastRun: '2024-03-18T09:00:00',
    owner: 'Mike Johnson',
    icon: '📊',
  },
];

const WorkflowView: React.FC = () => {
  const theme = useTheme();
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, workflowId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedWorkflow(workflowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWorkflow(null);
  };

  const handleWorkflowAction = (action: string) => {
    if (!selectedWorkflow) return;

    const updatedWorkflows = workflows.map(workflow => {
      if (workflow.id === selectedWorkflow) {
        switch (action) {
          case 'start':
            return {
              ...workflow,
              status: 'active' as const,
              steps: workflow.steps.map(step => ({
                ...step,
                status: step.status === 'paused' ? 'running' : step.status,
              })),
            };
          case 'pause':
            return {
              ...workflow,
              status: 'paused' as const,
              steps: workflow.steps.map(step => ({
                ...step,
                status: step.status === 'running' ? 'paused' : step.status,
              })),
            };
          case 'stop':
            return {
              ...workflow,
              status: 'completed' as const,
              steps: workflow.steps.map(step => ({
                ...step,
                status: step.status === 'running' ? 'completed' : step.status,
                progress: step.status === 'running' ? 100 : step.progress,
                endTime: step.status === 'running' ? new Date().toISOString() : step.endTime,
              })),
            };
          default:
            return workflow;
        }
      }
      return workflow;
    });

    setWorkflows(updatedWorkflows);
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'paused':
        return theme.palette.warning.main;
      case 'completed':
        return theme.palette.info.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      case 'running':
        return <TimelineIcon sx={{ color: theme.palette.primary.main }} />;
      case 'error':
        return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      case 'paused':
        return <PauseIcon sx={{ color: theme.palette.warning.main }} />;
      case 'pending':
        return <ScheduleIcon sx={{ color: theme.palette.grey[500] }} />;
      default:
        return null;
    }
  };

  const renderWorkflowCard = (workflow: Workflow) => (
    <Paper
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
        transition: 'all 0.2s ease-in-out',
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.08),
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 20px ${alpha('#000', 0.08)}`,
          borderColor: alpha(theme.palette.primary.main, 0.3),
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ 
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            width: 40,
            height: 40,
            fontSize: '1.2rem',
          }}>
            {workflow.icon}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ 
              fontSize: '1rem',
              fontWeight: 600,
              color: alpha('#000', 0.8),
            }}>
              {workflow.name}
            </Typography>
            <Typography variant="body2" sx={{ 
              color: alpha('#000', 0.6),
              fontSize: '0.875rem',
            }}>
              {workflow.description}
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, workflow.id)}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Chip
          label={workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
          size="small"
          sx={{
            backgroundColor: alpha(getStatusColor(workflow.status), 0.1),
            color: getStatusColor(workflow.status),
            fontWeight: 500,
            '& .MuiChip-label': {
              px: 1.5,
              fontSize: '0.75rem'
            }
          }}
        />
      </Box>

      <List sx={{ flex: 1 }}>
        {workflow.steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {getStepStatusIcon(step.status)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {step.name}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: alpha('#000', 0.6) }}>
                      {step.description}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={step.progress}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getStatusColor(step.status),
                          }
                        }}
                      />
                    </Box>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Typography variant="caption" sx={{ color: alpha('#000', 0.5) }}>
                  {step.progress}%
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
            {index < workflow.steps.length - 1 && (
              <Divider variant="fullWidth" sx={{ my: 1 }} />
            )}
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ 
        mt: 2,
        pt: 2,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="caption" sx={{ color: alpha('#000', 0.5) }}>
          Last run: {new Date(workflow.lastRun).toLocaleString()}
        </Typography>
        {workflow.nextRun && (
          <Typography variant="caption" sx={{ color: alpha('#000', 0.5) }}>
            Next run: {new Date(workflow.nextRun).toLocaleString()}
          </Typography>
        )}
      </Box>
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
            Workflows
          </Typography>
          <Typography variant="body1" sx={{ 
            color: alpha('#000', 0.6),
            fontSize: '0.875rem'
          }}>
            Manage and monitor your data workflows
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
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
            Export
          </Button>
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
            New Workflow
          </Button>
        </Box>
      </Box>

      {/* Workflow Grid */}
      <Grid container spacing={2}>
        {workflows.map((workflow) => (
          <Grid item xs={12} md={6} lg={4} key={workflow.id}>
            {renderWorkflowCard(workflow)}
          </Grid>
        ))}
      </Grid>

      {/* Workflow Actions Menu */}
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
        <MenuItem onClick={() => handleWorkflowAction('start')}>
          <ListItemIcon>
            <PlayArrowIcon fontSize="small" />
          </ListItemIcon>
          Start Workflow
        </MenuItem>
        <MenuItem onClick={() => handleWorkflowAction('pause')}>
          <ListItemIcon>
            <PauseIcon fontSize="small" />
          </ListItemIcon>
          Pause Workflow
        </MenuItem>
        <MenuItem onClick={() => handleWorkflowAction('stop')}>
          <ListItemIcon>
            <StopIcon fontSize="small" />
          </ListItemIcon>
          Stop Workflow
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default WorkflowView; 