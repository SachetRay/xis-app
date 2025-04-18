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
} from '@mui/icons-material';
import { userData } from '../../data/userData';

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const tools: Tool[] = [
  {
    id: 'data-wizard',
    name: 'Data Wizard',
    icon: <DataWizardIcon />,
    color: '#673AB7', // Deep Purple
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
    id: 'segment-genie',
    name: 'SegmentGenie',
    icon: <SegmentGenieIcon />,
    color: '#9C27B0', // Purple
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
  {
    id: 'ask-dgp',
    name: 'Ask DGP',
    icon: <AskDGPIcon />,
    color: '#795548', // Brown
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

interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  value?: any;
  children?: TreeNode[];
}

// Function to transform userData into a tree structure
const transformToTree = (data: any): TreeNode[] => {
  const result: TreeNode[] = [];
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        result.push({
          name: key,
          type: 'file',
          value: value
        });
      } else {
        result.push({
          name: key,
          type: 'folder',
          children: transformToTree(value)
        });
      }
    } else {
      result.push({
        name: key,
        type: 'file',
        value: value
      });
    }
  }
  
  return result;
};

// Function to search in the tree structure
const searchInTree = (nodes: TreeNode[], query: string): TreeNode[] => {
  let results: TreeNode[] = [];
  
  for (const node of nodes) {
    // Check if the current node matches
    if (node.name.toLowerCase().includes(query)) {
      results.push(node);
    }
    
    // If it's a folder, search in its children
    if (node.type === 'folder' && node.children) {
      const childResults = searchInTree(node.children, query);
      results = [...results, ...childResults];
    }
  }
  
  return results;
};

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState<(Tool | TreeNode)[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [activeUpdateSection, setActiveUpdateSection] = useState<string>('updates');

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Type guard functions
  const isTool = (result: Tool | TreeNode): result is Tool => {
    return 'color' in result;
  };

  const isTreeNode = (result: Tool | TreeNode): result is TreeNode => {
    return 'type' in result;
  };

  // Focus search input when overlay opens
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      // Small delay to ensure the overlay is rendered
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchExpanded]);

  // Add body class when search is expanded
  useEffect(() => {
    if (isSearchExpanded) {
      document.body.classList.add('search-overlay-active');
    } else {
      document.body.classList.remove('search-overlay-active');
    }
    
    return () => {
      document.body.classList.remove('search-overlay-active');
    };
  }, [isSearchExpanded]);

  // Update search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      // Search in tools
      const toolResults = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Search in data tree
      const dataResults = searchInTree(transformToTree(userData), searchQuery.toLowerCase());
      
      // Combine results
      setSearchResults([...toolResults, ...dataResults]);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

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
  const handleSearchResultClick = (result: Tool | TreeNode) => {
    if (isTool(result)) {
      // Handle tool navigation
      navigate(`/${result.id}`);
      setIsSearchExpanded(false);
    } else {
      // Handle data node navigation
      const treeData = transformToTree(userData);
      const path = getPathToNode(result, treeData);
      
      if (path.length > 0) {
        // Remove the last item from path as it will be the selected item
        const selectedItem = path[path.length - 1];
        const parentPath = path.slice(0, -1);
        
        const queryParams = new URLSearchParams();
        if (parentPath.length > 0) {
          queryParams.set('path', parentPath.join('/'));
        }
        queryParams.set('selected', selectedItem);
        queryParams.set('expand', result.type === 'folder' ? 'true' : 'false');
        
        navigate(`/data-wizard?${queryParams.toString()}`);
      } else {
        // If path is empty, just navigate with the selected node
        const queryParams = new URLSearchParams();
        queryParams.set('selected', result.name);
        queryParams.set('expand', result.type === 'folder' ? 'true' : 'false');
        
        navigate(`/data-wizard?${queryParams.toString()}`);
      }
      setIsSearchExpanded(false);
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
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 2.5 },
        mt: { xs: 2, sm: 3 }
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
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 2.5 },
        mt: { xs: 2, sm: 3 }
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
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 2.5 },
        mt: { xs: 2, sm: 3 }
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
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 2, sm: 2.5 },
      mt: { xs: 2, sm: 3 }
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
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      p: { xs: '16px', sm: '24px', md: '32px' },
      gap: { xs: 2, sm: 3, md: 4 },
      bgcolor: '#ffffff',
      maxWidth: '1400px',
      mx: 'auto',
      overflowY: 'auto',
      height: '100vh',
      pb: { xs: '80px', sm: '100px', md: '120px' },
      '&::-webkit-scrollbar': {
        width: '6px',
        display: 'none', // Hide scrollbar by default
      },
      '&:hover::-webkit-scrollbar': {
        display: 'block', // Show scrollbar only on hover
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: alpha('#000', 0.1),
        borderRadius: '3px',
        '&:hover': {
          background: alpha('#000', 0.2),
        },
      },
      // For Firefox
      scrollbarWidth: 'thin',
      scrollbarColor: `${alpha('#000', 0.1)} transparent`,
    }}>
      {/* Search Overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: isSearchExpanded ? 'flex' : 'none',
          alignItems: 'flex-start',
          justifyContent: 'center',
          pt: '15vh',
          opacity: isSearchExpanded ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          animation: isSearchExpanded ? 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          '@keyframes fadeIn': {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 }
          }
        }}
        onClick={() => setIsSearchExpanded(false)}
      >
        <Box
          sx={{
            width: '95%',
            maxWidth: '1400px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            p: 3,
            transform: isSearchExpanded ? 'translateY(0)' : 'translateY(-20px)',
            opacity: isSearchExpanded ? 1 : 0,
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            maxHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            animation: isSearchExpanded ? 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
            '@keyframes slideIn': {
              '0%': {
                transform: 'translateY(-20px)',
                opacity: 0,
              },
              '100%': {
                transform: 'translateY(0)',
                opacity: 1,
              }
            }
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <TextField
            autoFocus
            inputRef={searchInputRef}
            fullWidth
            placeholder="Search features, tools, or documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: alpha('#fff', 0.8),
                height: '64px',
                '& fieldset': {
                  borderColor: alpha(theme.palette.divider, 0.1),
                },
                '&:hover fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
                '&.Mui-focused fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                }
              },
              '& .MuiInputBase-input': {
                fontSize: '18px',
                fontWeight: 500,
              },
              animation: isSearchExpanded ? 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
              '@keyframes fadeIn': {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ 
                    fontSize: 28, 
                    color: alpha('#000', 0.4),
                    animation: isSearchExpanded ? 'pulse 1s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                    '@keyframes pulse': {
                      '0%': {
                        transform: 'scale(0.8)',
                        opacity: 0.5,
                      },
                      '50%': {
                        transform: 'scale(1.1)',
                      },
                      '100%': {
                        transform: 'scale(1)',
                        opacity: 1,
                      }
                    }
                  }} />
                </InputAdornment>
              ),
            }}
          />
          
          {/* Search Results */}
          <Box sx={{ 
            mt: 3, 
            overflow: 'auto',
            maxHeight: '50vh',
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha('#000', 0.08),
              borderRadius: 2,
              '&:hover': { backgroundColor: alpha('#000', 0.15) }
            },
            animation: isSearchExpanded ? 'fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 }
            }
          }}>
            {searchQuery.trim() ? (
              searchResults.length > 0 ? (
                <Box>
                  {/* Tools Section */}
                  {searchResults.filter(isTool).length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: alpha('#000', 0.6),
                          mb: 1,
                          px: 2,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        Tools
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        columnGap: '12px',
                        px: 2,
                        flexWrap: 'wrap'
                      }}>
                        {searchResults
                          .filter(isTool)
                          .map((result, index) => (
                            <Box
                              key={index}
                              onClick={() => handleSearchResultClick(result)}
                              sx={{
                                p: 2,
                                height: '100px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1.5,
                                cursor: 'pointer',
                                borderRadius: '12px',
                                transition: 'all 0.2s ease-in-out',
                                backgroundColor: alpha('#fff', 0.6),
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  backgroundColor: alpha('#fff', 0.8),
                                  '& .tool-icon': {
                                    transform: 'scale(1.1)',
                                    color: result.color,
                                  },
                                  '& .tool-name': {
                                    color: result.color,
                                  }
                                }
                              }}
                            >
                              <Box
                                className="tool-icon"
                                sx={{
                                  width: '32px',
                                  height: '32px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: result.color,
                                  transition: 'all 0.2s ease-in-out',
                                  '& svg': {
                                    fontSize: '24px'
                                  }
                                }}
                              >
                                {result.icon}
                              </Box>
                              <Typography
                                className="tool-name"
                                sx={{
                                  fontSize: '13px',
                                  fontWeight: 500,
                                  color: alpha('#000', 0.7),
                                  textAlign: 'center',
                                  transition: 'color 0.2s ease-in-out',
                                  lineHeight: 1.3
                                }}
                              >
                                {result.name}
                              </Typography>
                            </Box>
                          ))}
                      </Box>
                    </Box>
                  )}

                  {/* Data Items Section */}
                  {searchResults.filter(isTreeNode).length > 0 && (
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: alpha('#000', 0.6),
                          mb: 1,
                          px: 2,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        Data Items
                      </Typography>
                      <List>
                        {searchResults
                          .filter(isTreeNode)
                          .map((result, index) => (
                            <ListItem
                              key={index}
                              onClick={() => handleSearchResultClick(result)}
                              sx={{
                                cursor: 'pointer',
                                py: 2,
                                px: 3,
                                transition: 'all 0.2s ease-in-out',
                                borderRadius: '8px',
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                  transform: 'translateX(4px)'
                                },
                              }}
                            >
                              <ListItemIcon sx={{ 
                                minWidth: 40,
                                color: alpha('#000', 0.5),
                              }}>
                                {result.type === 'folder' ? (
                                  <FolderIcon sx={{ fontSize: 20 }} />
                                ) : (
                                  <InsertDriveFileIcon sx={{ fontSize: 20 }} />
                                )}
                              </ListItemIcon>
                              <ListItemText 
                                primary={result.name}
                                secondary={getPathToNode(result, transformToTree(userData)).join(' > ')}
                                sx={{
                                  '& .MuiTypography-root': {
                                    color: alpha('#000', 0.7),
                                    fontSize: '1rem',
                                    fontWeight: result.type === 'folder' ? 500 : 400,
                                  },
                                  '& .MuiTypography-body2': {
                                    color: alpha('#000', 0.5),
                                    fontSize: '0.75rem',
                                  }
                                }}
                              />
                            </ListItem>
                          ))}
                      </List>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  color: alpha('#000', 0.5)
                }}>
                  <Typography variant="body1">
                    No results found for "{searchQuery}"
                  </Typography>
                </Box>
              )
            ) : (
              <Box sx={{ 
                p: 4, 
                textAlign: 'center',
                color: alpha('#000', 0.5)
              }}>
                <Typography variant="body1">
                  Start typing to search...
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Add a style to blur the side navigation when search is expanded */}
      <style>
        {`
          body.search-overlay-active nav,
          body.search-overlay-active aside {
            filter: blur(8px);
            transition: filter 0.3s ease;
          }
        `}
      </style>

      {/* Welcome Message */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 600, 
          mb: 1,
          background: 'linear-gradient(45deg, #673AB7 30%, #3F51B5 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {getGreeting()}, {userData.name}
        </Typography>
        <Typography sx={{ 
          fontSize: '14px',
          color: 'rgba(0, 0, 0, 0.6)',
          letterSpacing: '0.01em'
        }}>
          Welcome to your Xperience Intelligence Studio
        </Typography>
      </Box>

      {/* Search Bar */}
      <TextField
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClick={() => setIsSearchExpanded(true)}
        size="medium"
        sx={{
          width: '100%',
          maxWidth: '1400px',
          alignSelf: 'center',
          mb: 3,
          '& .MuiOutlinedInput-root': {
            height: '56px',
            borderRadius: '16px',
            backgroundColor: alpha('#fff', 0.9),
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: alpha(theme.palette.primary.main, 0.2),
              borderWidth: '2px',
            },
            '&:hover': {
              transform: 'translateY(-2px)',
              backgroundColor: alpha('#fff', 1),
              '& fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.4),
              }
            },
            '&.Mui-focused': {
              transform: 'translateY(-2px)',
              backgroundColor: '#fff',
              '& fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              }
            }
          },
          '& .MuiInputBase-input': {
            fontSize: '16px',
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
                ml: 1
              }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mr: 1,
                color: alpha('#000', 0.4),
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.02em'
              }}>
                ⌘K
              </Box>
            </InputAdornment>
          )
        }}
      />

      {/* Tools Grid */}
      <Grid container spacing={2}>
        {tools.map((tool) => (
          <Grid item xs={6} sm={4} md={3} lg={12/7} key={tool.id}>
            <Box
              onClick={() => handleSearchResultClick(tool)}
              sx={{
                p: { xs: 2, sm: 2.5 },
                height: { xs: '100px', sm: '120px' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: 1, sm: 1.5 },
                cursor: 'pointer',
                borderRadius: '16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  '& .tool-icon': {
                    transform: 'scale(1.1) translateY(-2px)',
                    color: tool.color,
                  },
                  '& .tool-name': {
                    color: tool.color,
                  }
                },
                '&:active': {
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Box
                className="tool-icon"
                sx={{
                  width: { xs: '32px', sm: '40px' },
                  height: { xs: '32px', sm: '40px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  color: alpha(tool.color, 0.8),
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '& svg': {
                    fontSize: { xs: '24px', sm: '28px' }
                  }
                }}
              >
                {tool.icon}
              </Box>
              <Typography
                className="tool-name"
                sx={{
                  fontSize: { xs: '13px', sm: '14px' },
                  fontWeight: 500,
                  color: 'rgba(0, 0, 0, 0.87)',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  maxWidth: '90%',
                }}
              >
                {tool.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Update Pills */}
      <Box sx={{ 
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        mt: { xs: 2, sm: 3 },
        justifyContent: 'center'
      }}>
        {updatePills.map((pill) => (
          <Paper
            key={pill.id}
            elevation={0}
            onClick={() => setActiveUpdateSection(pill.id)}
            sx={{
              px: { xs: 2, sm: 2.5 },
              height: { xs: '32px', sm: '36px' },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              borderRadius: '18px',
              border: '1px solid',
              borderColor: pill.id === activeUpdateSection ? alpha('#0066cc', 0.2) : alpha('#000', 0.08),
              bgcolor: pill.id === activeUpdateSection ? alpha('#0066cc', 0.05) : alpha('#fff', 0.8),
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                borderColor: pill.id === activeUpdateSection ? alpha('#0066cc', 0.3) : alpha('#000', 0.12),
                bgcolor: pill.id === activeUpdateSection ? alpha('#0066cc', 0.08) : alpha('#000', 0.04),
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: pill.id === activeUpdateSection ? '#0066cc' : alpha('#000', 0.6),
                '& svg': {
                  fontSize: { xs: '16px', sm: '18px' },
                  transition: 'transform 0.2s ease',
                }
              }}
            >
              {pill.icon}
            </Box>
            <Typography
              sx={{
                fontSize: { xs: '13px', sm: '14px' },
                fontWeight: 500,
                color: pill.id === activeUpdateSection ? '#0066cc' : alpha('#000', 0.87),
                lineHeight: 1,
                whiteSpace: 'nowrap'
              }}
            >
              {pill.label}
            </Typography>
            {pill.count !== undefined && (
              <Chip
                label={pill.count}
                size="small"
                sx={{
                  height: '18px',
                  minWidth: '18px',
                  fontSize: '10px',
                  fontWeight: 600,
                  ml: 0.5,
                  bgcolor: pill.id === activeUpdateSection ? alpha('#0066cc', 0.1) : alpha('#000', 0.06),
                  color: pill.id === activeUpdateSection ? '#0066cc' : alpha('#000', 0.7),
                  '& .MuiChip-label': {
                    px: 0.5,
                  }
                }}
              />
            )}
          </Paper>
        ))}
      </Box>

      {/* Render the appropriate update section */}
      {renderUpdateSection()}
    </Box>
  );
};

export default HomePage; 