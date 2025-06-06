import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  alpha,
  useTheme,
  Button,
  InputBase,
  Avatar,
  useMediaQuery,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  AutoFixHigh as DataWizardIcon,
  Code as DevToolboxIcon,
  Security as DataGuardianIcon,
  Group as SegmentGenieIcon,
  Storage as ResourceIQIcon,
  Description as DocumentIcon,
  QuestionAnswer as AskDGPIcon,
  Update as UpdateIcon,
  HealthAndSafety as HealthIcon,
  Recommend as RecommendIcon,
  NewReleases as WhatsNewIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  Folder as FolderIcon,
  InsertDriveFile as InsertDriveFileIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  FolderOpen as FolderOpenIcon,
  Dashboard as WorkbenchIcon,
} from '@mui/icons-material';
import { userData } from '../../data/userData';
import { transformUserData } from '../../utils/userDataTransformer';
import { transformToTree, type TreeNode, searchInTree } from '../../utils/treeTransform';
import { useTransformedData } from '../../hooks/useTransformedData';
import { useUnifiedSearch } from '../../hooks/useUnifiedSearch';
import UnifiedSearch from '../Search/UnifiedSearch';
import { SearchResult, Message } from '../../types/search';

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  disabled?: boolean;
  placeholder?: boolean;
}

const tools: Tool[] = [
  {
    id: 'data-wizard',
    name: 'Data Wizard',
    icon: <DataWizardIcon />,
    color: '#673AB7', // Deep Purple
  },
  {
    id: 'workbench',
    name: 'Workbench',
    icon: <WorkbenchIcon />,
    color: '#607D8B',
  },
  {
    id: 'segment-genie',
    name: 'SegmentGenie',
    icon: <SegmentGenieIcon />,
    color: '#009688', // Teal
  },
  {
    id: 'dev-toolbox',
    name: 'Dev Toolbox',
    icon: <DevToolboxIcon />,
    color: '#FF9800', // Orange
  },
  {
    id: 'data-guardian',
    name: 'Data Guardian',
    icon: <DataGuardianIcon />,
    color: '#2196F3', // Blue
  },
  {
    id: 'resource-iq',
    name: 'ResourceIQ',
    icon: <ResourceIQIcon />,
    color: '#F44336', // Red
  },
  {
    id: 'document-hub',
    name: 'Document Hub',
    icon: <DocumentIcon />,
    color: '#00BCD4', // Cyan
  },
];

interface UpdatePill {
  id: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
}

const updatePills: UpdatePill[] = [
  {
    id: 'updates',
    icon: <UpdateIcon />,
    label: 'Data Updates',
    count: 12
  },
  {
    id: 'health',
    icon: <HealthIcon />,
    label: 'Data Health',
    count: 5
  },
  {
    id: 'recommendations',
    icon: <RecommendIcon />,
    label: 'Recommendations',
    count: 8
  },
  {
    id: 'whats-new',
    icon: <WhatsNewIcon />,
    label: "What's New",
    count: 3
  },
];

interface UpdateCard {
  id: string;
  type: 'added' | 'updated' | 'deprecated';
  date: string;
  title: string;
  description: string;
  ticketId: string;
}

const updateCards: UpdateCard[] = [
  {
    id: '1',
    type: 'added',
    date: 'Mar 02, 2025',
    title: 'New Schema Added',
    description: 'A new schema has been introduced to track e-commerce order events, including order creation, payment status, and fulfillment details. It will enable better tracking and segmentation of customer purchase behaviors.',
    ticketId: 'JIRA Ticket'
  },
  {
    id: '2',
    type: 'updated',
    date: 'Mar 02, 2025',
    title: 'Price Attribute in Experience Event',
    description: 'The data type has been changed from Integer to Decimal to support fractional pricing.',
    ticketId: 'JIRA Ticket'
  },
  {
    id: '3',
    type: 'deprecated',
    date: 'Mar 02, 2025',
    title: 'legacy_subscription_status in Profile Attributes',
    description: 'This attribute is being replaced by subscription_status_v2, which provides more detailed subscription states. Users should transition to the new attribute by June 30, 2025. Reach out to Priya Shanmugan for any concerns!',
    ticketId: 'JIRA Ticket'
  }
];

// Function to get the path to a node
const getPathToNode = (targetNode: TreeNode, tree: TreeNode[]): string[] => {
  const findPath = (nodes: TreeNode[], target: TreeNode, currentPath: string[]): string[] | null => {
    for (const node of nodes) {
      if (node.name === target.name && node.type === target.type) {
        return [...currentPath, node.name];
      }
      
      if (node.type === 'folder' && node.children) {
        const path = findPath(node.children, target, [...currentPath, node.name]);
        if (path) return path;
      }
    }
    return null;
  };

  for (const rootNode of tree) {
    const path = findPath([rootNode], targetNode, []);
    if (path) return path;
  }
  return [];
};

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    isOpen: isSearchOpen,
    searchResults: unifiedSearchResults,
    chatHistory,
    openSearch,
    closeSearch,
    handleSearch,
    handleChatSubmit,
    clearHistory,
    isChatMode,
  } = useUnifiedSearch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [activeUpdateSection, setActiveUpdateSection] = useState<string>('updates');
  const { transformedData } = useTransformedData();

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Type guard functions
  const isTool = (result: Tool | SearchResult): result is Tool => {
    return !('type' in result);
  };

  const getUpdateIcon = (type: UpdateCard['type']) => {
    switch (type) {
      case 'added':
        return <AddIcon fontSize="small" />;
      case 'updated':
        return <UpdateIcon fontSize="small" />;
      case 'deprecated':
        return <WarningIcon fontSize="small" />;
    }
  };

  const getUpdateColor = (type: UpdateCard['type']) => {
    switch (type) {
      case 'added':
        return '#10b981'; // Success green
      case 'updated':
        return '#3b82f6'; // Info blue
      case 'deprecated':
        return '#ef4444'; // Error red
    }
  };

  // Function to handle search result click
  const handleSearchResultClick = (result: Tool | SearchResult) => {
    if (isTool(result)) {
      // Handle tool navigation
      navigate(`/${result.id}`);
      closeSearch();
    } else if (transformedData && 'path' in result) {
      // Handle data node navigation using path information
      const path = result.path || [];
      
      if (path.length > 0) {
        // Remove the last item from path as it will be the selected item
        const selectedItem = path[path.length - 1];
        const parentPath = path.slice(0, -1);
        
        const queryParams = new URLSearchParams();
        if (parentPath.length > 0) {
          queryParams.set('path', parentPath.join('/'));
        }
        queryParams.set('selected', selectedItem);
        queryParams.set('expand', 'true');  // Always expand when navigating from search
        
        navigate(`/data-wizard?${queryParams.toString()}`);
      } else {
        // If path is empty, just navigate with the selected node
        const queryParams = new URLSearchParams();
        queryParams.set('selected', result.name);
        queryParams.set('expand', 'true');  // Always expand when navigating from search
        
        navigate(`/data-wizard?${queryParams.toString()}`);
      }
      closeSearch();
    }
  };

  // Data Health Component
  const DataHealthSection = () => {
    const healthMetrics = [
      { name: 'Data Completeness', value: 92, color: '#4CAF50' },
      { name: 'Data Accuracy', value: 88, color: '#2196F3' },
      { name: 'Data Freshness', value: 95, color: '#FF9800' },
      { name: 'Schema Compliance', value: 90, color: '#9C27B0' },
    ];

    const healthIssues = [
      { 
        id: 'h1', 
        severity: 'high', 
        title: 'Missing Required Fields', 
        description: '15% of customer profiles are missing required contact information.',
        affected: '12,450 profiles',
        date: 'May 15, 2025'
      },
      { 
        id: 'h2', 
        severity: 'medium', 
        title: 'Schema Validation Errors', 
        description: 'Product catalog has 234 items with invalid price formats.',
        affected: '234 products',
        date: 'May 12, 2025'
      },
      { 
        id: 'h3', 
        severity: 'low', 
        title: 'Data Duplication', 
        description: 'Potential duplicate customer records detected in the CRM system.',
        affected: '87 profiles',
        date: 'May 10, 2025'
      },
    ];

    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case 'high': return '#F44336';
        case 'medium': return '#FF9800';
        case 'low': return '#4CAF50';
        default: return '#9E9E9E';
      }
    };

    return (
      <Box sx={{ 
        backgroundColor: 'white',
        borderRadius: '16px',
        p: { xs: 2, sm: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Typography sx={{ 
          fontSize: { xs: '16px', sm: '18px' },
          fontWeight: 600,
          color: alpha('#000', 0.87),
          letterSpacing: '-0.01em',
          pl: 1
        }}>
          Data Health Overview
        </Typography>
        
        {/* Health Metrics */}
        <Grid container spacing={2}>
          {healthMetrics.map((metric) => (
            <Grid item xs={6} sm={3} key={metric.name}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: alpha('#000', 0.08),
                  bgcolor: alpha('#fff', 0.8),
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography sx={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: alpha('#000', 0.7),
                }}>
                  {metric.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ 
                    fontSize: '24px',
                    fontWeight: 600,
                    color: metric.color,
                  }}>
                    {metric.value}%
                  </Typography>
                  <Box sx={{ flex: 1, height: '4px', bgcolor: alpha('#000', 0.05), borderRadius: '2px', overflow: 'hidden' }}>
                    <Box sx={{ width: `${metric.value}%`, height: '100%', bgcolor: metric.color, borderRadius: '2px' }} />
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Health Issues */}
        <Typography sx={{ 
          fontSize: { xs: '16px', sm: '18px' },
          fontWeight: 600,
          color: alpha('#000', 0.87),
          letterSpacing: '-0.01em',
          pl: 1,
          mt: 1
        }}>
          Health Issues
        </Typography>
        
        <Grid container spacing={2}>
          {healthIssues.map((issue) => (
            <Grid item xs={12} key={issue.id}>
              <Box
                sx={{
                  p: { xs: '16px', sm: '20px' },
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: alpha(getSeverityColor(issue.severity), 0.2),
                  bgcolor: alpha('#fff', 0.8),
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    bgcolor: getSeverityColor(issue.severity),
                  }
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography sx={{ 
                      fontSize: '16px',
                      fontWeight: 600,
                      color: alpha('#000', 0.87),
                    }}>
                      {issue.title}
                    </Typography>
                    <Chip 
                      label={issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)} 
                      size="small"
                      sx={{ 
                        bgcolor: alpha(getSeverityColor(issue.severity), 0.1),
                        color: getSeverityColor(issue.severity),
                        fontWeight: 500,
                        fontSize: '12px',
                      }}
                    />
                  </Box>
                  <Typography sx={{ 
                    fontSize: '14px',
                    color: alpha('#000', 0.7),
                  }}>
                    {issue.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography sx={{ 
                      fontSize: '13px',
                      color: alpha('#000', 0.6),
                      fontWeight: 500,
                    }}>
                      {issue.affected}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '13px',
                      color: alpha('#000', 0.5),
                    }}>
                      {issue.date}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Recommendations Component
  const RecommendationsSection = () => {
    const recommendations = [
      { 
        id: 'r1', 
        category: 'Data Quality', 
        title: 'Improve Customer Data Completeness', 
        description: 'Implement validation rules to ensure all required customer fields are populated during signup.',
        impact: 'High',
        effort: 'Medium',
        priority: 'High'
      },
      { 
        id: 'r2', 
        category: 'Performance', 
        title: 'Optimize Query Performance', 
        description: 'Add indexes to frequently queried fields in the customer database to improve response times.',
        impact: 'Medium',
        effort: 'Low',
        priority: 'Medium'
      },
      { 
        id: 'r3', 
        category: 'Integration', 
        title: 'Connect CRM with Marketing Platform', 
        description: 'Establish a real-time sync between your CRM and marketing automation platform for better customer targeting.',
        impact: 'High',
        effort: 'High',
        priority: 'High'
      },
      { 
        id: 'r4', 
        category: 'Security', 
        title: 'Implement Data Encryption', 
        description: 'Add encryption for sensitive customer data to comply with upcoming privacy regulations.',
        impact: 'High',
        effort: 'Medium',
        priority: 'High'
      },
    ];

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'High': return '#F44336';
        case 'Medium': return '#FF9800';
        case 'Low': return '#4CAF50';
        default: return '#9E9E9E';
      }
    };

    return (
      <Box sx={{ 
        backgroundColor: 'white',
        borderRadius: '16px',
        p: { xs: 2, sm: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Typography sx={{ 
          fontSize: { xs: '16px', sm: '18px' },
          fontWeight: 600,
          color: alpha('#000', 0.87),
          letterSpacing: '-0.01em',
          pl: 1
        }}>
          Recommendations
        </Typography>
        
        <Grid container spacing={2}>
          {recommendations.map((rec) => (
            <Grid item xs={12} sm={6} key={rec.id}>
              <Box
                sx={{
                  p: { xs: '16px', sm: '20px' },
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: alpha('#000', 0.08),
                  bgcolor: alpha('#fff', 0.8),
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Chip 
                    label={rec.category} 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                      fontSize: '12px',
                    }}
                  />
                  <Chip 
                    label={rec.priority} 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(getPriorityColor(rec.priority), 0.1),
                      color: getPriorityColor(rec.priority),
                      fontWeight: 500,
                      fontSize: '12px',
                    }}
                  />
                </Box>
                
                <Typography sx={{ 
                  fontSize: '16px',
                  fontWeight: 600,
                  color: alpha('#000', 0.87),
                }}>
                  {rec.title}
                </Typography>
                
                <Typography sx={{ 
                  fontSize: '14px',
                  color: alpha('#000', 0.7),
                  flex: 1,
                }}>
                  {rec.description}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mt: 1,
                  pt: 1,
                  borderTop: '1px solid',
                  borderColor: alpha('#000', 0.06),
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ 
                      fontSize: '13px',
                      color: alpha('#000', 0.6),
                    }}>
                      Impact:
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '13px',
                      fontWeight: 500,
                      color: alpha('#000', 0.8),
                    }}>
                      {rec.impact}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ 
                      fontSize: '13px',
                      color: alpha('#000', 0.6),
                    }}>
                      Effort:
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '13px',
                      fontWeight: 500,
                      color: alpha('#000', 0.8),
                    }}>
                      {rec.effort}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // What's New Component
  const WhatsNewSection = () => {
    const newFeatures = [
      { 
        id: 'n1', 
        date: 'May 15, 2025', 
        title: 'Enhanced Segmentation Engine', 
        description: 'Our segmentation engine now supports more complex queries and improved performance for large datasets.',
        category: 'Feature',
        version: 'v2.3.0'
      },
      { 
        id: 'n2', 
        date: 'May 10, 2025', 
        title: 'New Data Connectors', 
        description: 'Added support for connecting to Snowflake, BigQuery, and Databricks data warehouses.',
        category: 'Integration',
        version: 'v2.2.5'
      },
      { 
        id: 'n3', 
        date: 'May 5, 2025', 
        title: 'Improved UI/UX', 
        description: 'Redesigned dashboard with better visualization options and more intuitive navigation.',
        category: 'UI',
        version: 'v2.2.0'
      },
      { 
        id: 'n4', 
        date: 'April 28, 2025', 
        title: 'API Enhancements', 
        description: 'Extended API capabilities with new endpoints for batch operations and improved rate limits.',
        category: 'API',
        version: 'v2.1.8'
      },
    ];

    return (
      <Box sx={{ 
        backgroundColor: 'white',
        borderRadius: '16px',
        p: { xs: 2, sm: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Typography sx={{ 
          fontSize: { xs: '16px', sm: '18px' },
          fontWeight: 600,
          color: alpha('#000', 0.87),
          letterSpacing: '-0.01em',
          pl: 1
        }}>
          What's New
        </Typography>
        
        <Grid container spacing={2}>
          {newFeatures.map((feature) => (
            <Grid item xs={12} key={feature.id}>
              <Box
                sx={{
                  p: { xs: '16px', sm: '20px' },
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: alpha('#000', 0.08),
                  bgcolor: alpha('#fff', 0.8),
                  display: 'flex',
                  gap: 2,
                  alignItems: 'flex-start',
                }}
              >
                <Box
                  sx={{
                    width: { xs: '40px', sm: '48px' },
                    height: { xs: '40px', sm: '48px' },
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                  }}
                >
                  <WhatsNewIcon />
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography sx={{ 
                      fontSize: '16px',
                      fontWeight: 600,
                      color: alpha('#000', 0.87),
                    }}>
                      {feature.title}
                    </Typography>
                    <Chip 
                      label={feature.version} 
                      size="small"
                      sx={{ 
                        bgcolor: alpha('#000', 0.05),
                        color: alpha('#000', 0.7),
                        fontWeight: 500,
                        fontSize: '12px',
                      }}
                    />
                  </Box>
                  
                  <Typography sx={{ 
                    fontSize: '14px',
                    color: alpha('#000', 0.7),
                    mb: 1,
                  }}>
                    {feature.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={feature.category} 
                      size="small"
                      sx={{ 
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                        fontWeight: 500,
                        fontSize: '12px',
                      }}
                    />
                    <Typography sx={{ 
                      fontSize: '13px',
                      color: alpha('#000', 0.5),
                    }}>
                      {feature.date}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Updates Section (existing)
  const UpdatesSection = () => (
    <Box sx={{ 
      backgroundColor: 'white',
      borderRadius: '16px',
      p: { xs: 2, sm: 3 },
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Typography sx={{ 
        fontSize: { xs: '16px', sm: '18px' },
        fontWeight: 600,
        color: alpha('#000', 0.87),
        letterSpacing: '-0.01em',
        pl: 1
      }}>
        March, 2025
      </Typography>
      <Grid container spacing={2}>
        {updateCards.map((card) => (
          <Grid item xs={12} key={card.id}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: '20px', sm: '24px' },
                borderRadius: '16px',
                border: '1px solid',
                borderColor: alpha(getUpdateColor(card.type), 0.1),
                bgcolor: alpha('#fff', 0.8),
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${alpha(getUpdateColor(card.type), 0.12)}`,
                  borderColor: alpha(getUpdateColor(card.type), 0.2),
                  backgroundColor: alpha(getUpdateColor(card.type), 0.02),
                }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'flex-start' },
                gap: { xs: 2, sm: 0 }
              }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flex: 1 }}>
                  <Box
                    sx={{
                      width: { xs: '32px', sm: '36px' },
                      height: { xs: '32px', sm: '36px' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '10px',
                      bgcolor: alpha(getUpdateColor(card.type), 0.1),
                      color: getUpdateColor(card.type),
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                      '& svg': {
                        fontSize: { xs: '18px', sm: '20px' }
                      }
                    }}
                  >
                    {getUpdateIcon(card.type)}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: getUpdateColor(card.type),
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em'
                        }}
                      >
                        {card.type}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: alpha('#000', 0.45),
                        }}
                      >
                        {card.date}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: { xs: '14px', sm: '15px' },
                        fontWeight: 600,
                        color: alpha('#000', 0.87),
                        mb: 1,
                        lineHeight: 1.4
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: '13px', sm: '14px' },
                        color: alpha('#000', 0.6),
                        lineHeight: 1.6
                      }}
                    >
                      {card.description}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: 'auto',
                    height: { xs: '28px', sm: '32px' },
                    px: 2,
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '8px',
                    borderColor: alpha('#000', 0.08),
                    color: alpha('#000', 0.6),
                    ml: { xs: 0, sm: 3 },
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: alpha('#0066cc', 0.3),
                      bgcolor: alpha('#0066cc', 0.04),
                      color: '#0066cc',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  {card.ticketId}
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Render the appropriate section based on activeUpdateSection
  const renderUpdateSection = () => {
    switch (activeUpdateSection) {
      case 'health':
        return <DataHealthSection />;
      case 'recommendations':
        return <RecommendationsSection />;
      case 'whats-new':
        return <WhatsNewSection />;
      case 'updates':
      default:
        return <UpdatesSection />;
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Unified Search Component */}
      <UnifiedSearch
        isOpen={isSearchOpen}
        onClose={closeSearch}
        onSearch={handleSearch}
        onChatSubmit={handleChatSubmit}
        searchResults={unifiedSearchResults}
        chatHistory={chatHistory}
        clearHistory={clearHistory}
        isChatMode={isChatMode}
        onResultClick={handleSearchResultClick}
      />

      {/* Welcome Message */}
      <Box sx={{ 
        mb: { xs: 6, sm: 8 },
        mt: { xs: 3, sm: 4 }
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          mb: 2,
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em',
        }}>
          {getGreeting()}, Sachet
        </Typography>
        <Typography sx={{ 
          fontSize: '1rem',
          color: alpha('#000', 0.7),
          letterSpacing: '0.01em',
          lineHeight: 1.5,
          maxWidth: '600px'
        }}>
          Welcome to your DMe Xperience Intelligence Studio
        </Typography>
      </Box>

      {/* Search Bar */}
      <TextField
        placeholder="Search features, tools, or data..."
        onClick={openSearch}
        size="medium"
        sx={{
          width: '100%',
          maxWidth: '1400px',
          alignSelf: 'center',
          mb: { xs: 4, sm: 5 },
          '& .MuiOutlinedInput-root': {
            height: { xs: '56px', sm: '64px' },
            borderRadius: '20px',
            backgroundColor: alpha('#fff', 0.9),
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 4px 20px ${alpha('#000', 0.04)}`,
            '& fieldset': {
              borderColor: alpha(theme.palette.primary.main, 0.15),
              borderWidth: '2px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            '&:hover': {
              transform: 'translateY(-2px)',
              backgroundColor: alpha('#fff', 1),
              boxShadow: `0 8px 30px ${alpha('#000', 0.08)}`,
              '& fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.3),
              }
            },
            '&.Mui-focused': {
              transform: 'translateY(-2px)',
              backgroundColor: '#fff',
              boxShadow: `0 8px 30px ${alpha('#000', 0.1)}`,
              '& fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              }
            }
          },
          '& .MuiInputBase-input': {
            fontSize: { xs: '0.9rem', sm: '1rem' },
            fontWeight: 500,
            color: alpha('#000', 0.87),
            '&::placeholder': {
              color: alpha('#000', 0.4),
              opacity: 1,
            }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ 
                fontSize: 24, 
                color: alpha('#000', 0.4),
                ml: 1.5,
                transition: 'color 0.2s ease',
              }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mr: 2,
                px: 1,
                py: 0.5,
                borderRadius: '6px',
                backgroundColor: alpha('#000', 0.04),
                color: alpha('#000', 0.6),
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.02em',
                fontFamily: 'monospace'
              }}>
                ⌘K
              </Box>
            </InputAdornment>
          ),
          readOnly: true,
        }}
      />

      {/* Tools Section */}
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          gap: { xs: '16px', sm: '24px' },
          width: '100%',
          overflowX: 'auto',
          pb: { xs: 2, md: 0 },
          justifyContent: 'center',
          '&::-webkit-scrollbar': {
            height: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: alpha('#000', 0.03),
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha('#000', 0.1),
            borderRadius: '4px',
            '&:hover': {
              background: alpha('#000', 0.15)
            }
          },
          '&::before, &::after': {
            content: '""',
            flex: '1 0 auto'
          }
        }}
      >
        {tools.map((tool) => (
          <Box
            key={tool.id}
            onClick={() => handleSearchResultClick(tool)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.2, 0, 0.2, 1)',
              width: { xs: '140px', sm: '160px' },
              p: 2,
              borderRadius: '16px',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: alpha(tool.color, 0.08),
                transform: 'translateY(-2px)',
                '& .tool-icon': {
                  backgroundColor: alpha(tool.color, 0.1),
                  color: tool.color,
                  transform: 'scale(1.05)',
                },
                '& .tool-name': {
                  color: tool.color,
                }
              }
            }}
          >
            <Box
              className="tool-icon"
              sx={{
                width: { xs: '48px', sm: '56px' },
                height: { xs: '48px', sm: '56px' },
                borderRadius: '14px',
                backgroundColor: alpha(tool.color, 0.08),
                color: alpha(tool.color, 0.8),
                transition: 'all 0.3s cubic-bezier(0.2, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& svg': {
                  fontSize: { xs: '22px', sm: '24px' },
                  transition: 'transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)',
                }
              }}
            >
              {tool.icon}
            </Box>
            <Typography
              className="tool-name"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: alpha('#000', 0.75),
                textAlign: 'center',
                transition: 'color 0.2s ease-out',
                lineHeight: 1.2,
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {tool.name}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Update Pills */}
      <Box sx={{ 
        display: 'flex',
        gap: { xs: 1.5, sm: 2 },
        flexWrap: 'wrap',
        mt: { xs: 2, sm: 3 },
        mb: { xs: 3, sm: 4 },
        justifyContent: 'center'
      }}>
        {updatePills.map((pill) => (
          <Paper
            key={pill.id}
            elevation={0}
            onClick={() => setActiveUpdateSection(pill.id)}
            sx={{
              px: { xs: 2.5, sm: 3 },
              height: { xs: '36px', sm: '40px' },
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              borderRadius: '20px',
              border: '2px solid',
              borderColor: pill.id === activeUpdateSection ? alpha('#0066cc', 0.3) : alpha('#000', 0.08),
              bgcolor: pill.id === activeUpdateSection ? alpha('#0066cc', 0.08) : alpha('#fff', 0.8),
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 24px ${alpha('#000', 0.08)}`,
                borderColor: pill.id === activeUpdateSection ? alpha('#0066cc', 0.4) : alpha('#000', 0.12),
                bgcolor: pill.id === activeUpdateSection ? alpha('#0066cc', 0.12) : alpha('#fff', 0.95),
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: pill.id === activeUpdateSection ? '#0066cc' : alpha('#000', 0.6),
                '& svg': {
                  fontSize: { xs: '18px', sm: '20px' },
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: pill.id === activeUpdateSection ? 'scale(1.2)' : 'scale(1)',
                }
              }}
            >
              {pill.icon}
            </Box>
            <Typography
              sx={{
                fontSize: { xs: '13px', sm: '14px' },
                fontWeight: 600,
                color: pill.id === activeUpdateSection ? '#0066cc' : alpha('#000', 0.75),
                lineHeight: 1,
                whiteSpace: 'nowrap',
                letterSpacing: '0.01em'
              }}
            >
              {pill.label}
            </Typography>
            {pill.count !== undefined && (
              <Chip
                label={pill.count}
                size="small"
                sx={{
                  height: '20px',
                  minWidth: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  ml: 0.5,
                  bgcolor: pill.id === activeUpdateSection ? alpha('#0066cc', 0.15) : alpha('#000', 0.06),
                  color: pill.id === activeUpdateSection ? '#0066cc' : alpha('#000', 0.7),
                  border: '1px solid',
                  borderColor: pill.id === activeUpdateSection ? alpha('#0066cc', 0.3) : 'transparent',
                  '& .MuiChip-label': {
                    px: 0.75,
                  }
                }}
              />
            )}
          </Paper>
        ))}
      </Box>

      {/* Render the appropriate update section */}
      {renderUpdateSection()}

      <Typography>
        {/* Fix escaped single quote */}
        That&apos;s all for now
      </Typography>
    </Box>
  );
};

export default HomePage; 