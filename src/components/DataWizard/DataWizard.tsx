import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  alpha,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Divider,
  InputAdornment,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import GetAppIcon from '@mui/icons-material/GetApp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userData } from '../../data/userData';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  value?: any;
  children?: TreeNode[];
}

interface ColumnData {
  items: TreeNode[];
  selectedItem: TreeNode | null;
}

interface SelectedDetails {
  name: string;
  value: any;
  type: 'folder' | 'file';
  path: string[];
  description?: string;
  owner?: string;
  lastModified?: string;
  usageCount?: number;
  status?: string;
  dataType?: string;
}

interface FolderTypeDetails {
  description: string;
  usageCount: number;
  status: string;
}

interface FileTypeDetails {
  description: string;
  dataType: string;
  status: string;
}

interface FolderTypes {
  'Anonymous User': FolderTypeDetails;
  'Email Domain Properties': FolderTypeDetails;
  'Member Account GUID': FolderTypeDetails;
  'System Computed Attributes': FolderTypeDetails;
  [key: string]: FolderTypeDetails | undefined;
}

interface FileTypes {
  'BriteVerify Email Invalid': FileTypeDetails;
  'Email Domain': FileTypeDetails;
  'Email Security Token': FileTypeDetails;
  'Decile 1 Month': FileTypeDetails;
  [key: string]: FileTypeDetails | undefined;
}

// Dummy data for usage timeline chart
const generateUsageData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      usage: Math.floor(Math.random() * 1000) + 500,
    });
  }
  
  return data;
};

// Dummy data for intermediate tables
const intermediateTables = [
  { name: 'Raw_User_Data', description: 'Raw user data collected from various sources', rowCount: 1250000 },
  { name: 'Processed_User_Profiles', description: 'Processed and normalized user profiles', rowCount: 980000 },
  { name: 'User_Segments', description: 'User segments based on behavior and attributes', rowCount: 45000 },
  { name: 'Final_User_Attributes', description: 'Final user attributes used in applications', rowCount: 750000 },
];

// Simple and efficient tree transformation
const transformToTree = (obj: any): TreeNode[] => {
  if (!obj || typeof obj !== 'object') return [];

  return Object.entries(obj).map(([key, value]) => {
    // Treat arrays the same as objects - they will be displayed as folders
    const isLeaf = typeof value !== 'object' || value === null;
    return {
      name: key,
      type: isLeaf ? 'file' : 'folder',
      value: isLeaf ? value : undefined,
      children: !isLeaf ? transformToTree(value) : undefined
    };
  });
};

const DataWizard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState<TreeNode[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [columns, setColumns] = useState<ColumnData[]>([
    { items: transformToTree(userData), selectedItem: null }
  ]);
  const [selectedDetails, setSelectedDetails] = useState<SelectedDetails | null>(null);
  const [animatingColumns, setAnimatingColumns] = useState<number[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const detailsPathScrollRef = useRef<HTMLDivElement>(null);
  const [selectedPathIndex, setSelectedPathIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();

  // Handle URL parameters
  useEffect(() => {
    const path = searchParams.get('path');
    const selected = searchParams.get('selected');
    const expand = searchParams.get('expand') === 'true';

    if (path || selected) {
      const treeData = transformToTree(userData);
      const pathArray = path ? path.split('/') : [];
      
      // Reset columns and build the path
      const newColumns: ColumnData[] = [];
      let currentItems = treeData;
      let selectedItem: TreeNode | null = null;
      
      // Build columns for the path
      for (const pathItem of pathArray) {
        const columnItem = currentItems.find(item => item.name === pathItem);
        if (columnItem) {
          newColumns.push({ items: currentItems, selectedItem: columnItem });
          currentItems = columnItem.children || [];
        }
      }
      
      // If there's a selected item, find it in the current level
      if (selected) {
        const foundItem = currentItems.find(item => item.name === selected);
        if (foundItem) {
          selectedItem = foundItem;
          // Add or update the last column with the selected item
          if (newColumns.length > 0) {
            newColumns[newColumns.length - 1] = { 
              items: currentItems, 
              selectedItem 
            };
          } else {
            newColumns.push({ items: currentItems, selectedItem });
          }
          
          // If expand is true and it's a folder, add its children
          if (expand && selectedItem.type === 'folder' && selectedItem.children?.length) {
            newColumns.push({ items: selectedItem.children, selectedItem: null });
          }
          
          // Set selected details with the full path
          const fullPath = path ? [...pathArray, selected] : [selected];
          const details = getItemDetails(selectedItem, fullPath);
          setSelectedDetails(details);
          
          // Log for debugging
          console.log('Setting selected details:', {
            name: selectedItem.name,
            path: fullPath,
            details
          });
        }
      }
      
      setColumns(newColumns);
    }
  }, [searchParams]);

  // Add a debug effect to log when selectedDetails changes
  useEffect(() => {
    console.log('Selected details updated:', selectedDetails);
  }, [selectedDetails]);

  // Auto-scroll when new columns or path items are added
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
    if (detailsPathScrollRef.current) {
      detailsPathScrollRef.current.scrollTo({
        left: detailsPathScrollRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [columns.length, selectedDetails?.path.length]);

  // Add search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchInTree(transformToTree(userData), searchQuery.toLowerCase());
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Focus search input when overlay opens
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      // Small delay to ensure the overlay is rendered
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchExpanded]);

  // Effect to toggle body class for blur effect
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
  const getPathToNode = (node: TreeNode, tree: TreeNode[]): string[] => {
    const findPath = (currentNode: TreeNode, targetNode: TreeNode, currentPath: string[]): string[] | null => {
      if (currentNode.name === targetNode.name) {
        return [...currentPath, currentNode.name];
      }
      
      if (currentNode.type === 'folder' && currentNode.children) {
        for (const child of currentNode.children) {
          const path = findPath(child, targetNode, [...currentPath, currentNode.name]);
          if (path) return path;
        }
      }
      
      return null;
    };
    
    for (const rootNode of tree) {
      const path = findPath(rootNode, node, []);
      if (path) return path;
    }
    
    return [node.name];
  };

  // Function to navigate to a search result
  const navigateToSearchResult = (result: TreeNode) => {
    const path = getPathToNode(result, transformToTree(userData));
    
    // Reset columns and build the path
    const newColumns: ColumnData[] = [];
    let currentItems = transformToTree(userData);
    
    for (const pathItem of path) {
      const columnItem = currentItems.find(item => item.name === pathItem);
      if (columnItem) {
        newColumns.push({ items: currentItems, selectedItem: columnItem });
        currentItems = columnItem.children || [];
      }
    }
    
    setColumns(newColumns);
    setSelectedDetails(getItemDetails(result, path));
    setIsSearchExpanded(false);
  };

  const handleNavigationChange = (_: React.MouseEvent<HTMLElement>, newValue: number) => {
    if (newValue !== null) {
      setTabValue(newValue);
    }
  };

  const navigationOptions = [
    { 
      label: 'Profile Attributes', 
      icon: <PersonIcon sx={{ fontSize: 18 }} />,
      description: 'User profile and identity attributes'
    },
    { 
      label: 'Experience Events', 
      icon: <BarChartIcon sx={{ fontSize: 18 }} />,
      description: 'User interaction and behavior events'
    },
    { 
      label: 'Lookup Attributes', 
      icon: <SearchIcon sx={{ fontSize: 18 }} />,
      description: 'Reference and lookup data attributes'
    },
  ];

  const getItemDetails = (item: TreeNode, path: string[]): SelectedDetails => {
    const baseDetails = {
      name: item.name,
      value: item.value,
      type: item.type,
      path,
      lastModified: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
      owner: ['Priya Shanmugan', 'John Smith', 'Sarah Chen', 'Mike Johnson'][Math.floor(Math.random() * 4)]
    };

    if (item.type === 'folder') {
      const folderTypes: FolderTypes = {
        'Anonymous User': {
          description: 'Contains attributes related to anonymous user tracking and identification.',
          usageCount: 1247,
          status: 'Active',
        },
        'Email Domain Properties': {
          description: 'Email-related configurations and domain-specific settings.',
          usageCount: 856,
          status: 'Active',
        },
        'Member Account GUID': {
          description: 'Global unique identifier management for member accounts.',
          usageCount: 2341,
          status: 'Active',
        },
        'System Computed Attributes': {
          description: 'Automatically calculated and maintained system attributes.',
          usageCount: 1589,
          status: 'Active',
        }
      };

      return {
        ...baseDetails,
        ...(folderTypes[item.name] || {
          description: 'A collection of related attributes and configurations.',
          usageCount: Math.floor(Math.random() * 2000) + 500,
          status: Math.random() > 0.1 ? 'Active' : 'Deprecated'
        })
      };
    } else {
      const fileTypes: FileTypes = {
        'BriteVerify Email Invalid': {
          description: 'Indicates if an email address has been marked as invalid by BriteVerify.',
          dataType: 'Boolean',
          status: 'Active',
        },
        'Email Domain': {
          description: 'The domain portion of the user\'s email address.',
          dataType: 'String',
          status: 'Active',
        },
        'Email Security Token': {
          description: 'Security token associated with email verification process.',
          dataType: 'String',
          status: 'Active',
        },
        'Decile 1 Month': {
          description: 'Monthly decile calculation for user segmentation.',
          dataType: 'Number',
          status: 'Active',
        }
      };

      return {
        ...baseDetails,
        ...(fileTypes[item.name] || {
          description: 'A structured identifier used for data organization and management.',
          dataType: typeof item.value === 'string' ? 'String' :
                   typeof item.value === 'number' ? 'Number' :
                   typeof item.value === 'boolean' ? 'Boolean' : 'Object',
          status: Math.random() > 0.1 ? 'Active' : 'Deprecated'
        })
      };
    }
  };

  const handleItemClick = (item: TreeNode, columnIndex: number) => {
    const newColumns = columns.slice(0, columnIndex + 1);
    newColumns[columnIndex] = { ...newColumns[columnIndex], selectedItem: item };
    
    if (item.type === 'folder' && item.children?.length) {
      setAnimatingColumns([...animatingColumns, columnIndex + 1]);
      setTimeout(() => {
        newColumns.push({ items: item.children || [], selectedItem: null });
        setColumns(newColumns);
      }, 150);
    } else {
      setColumns(newColumns);
    }
    
    // Calculate the path from columns only
    const path = newColumns.map((col: ColumnData) => col.selectedItem?.name || '').filter(Boolean);
    
    setSelectedDetails(getItemDetails(item, path));
    setSelectedPathIndex(null);
  };

  const handlePathClick = (pathIndex: number, isDetailsPanelPath: boolean = false) => {
    const clickedItem = columns[pathIndex].selectedItem;
    if (clickedItem) {
      if (isDetailsPanelPath) {
        setSelectedPathIndex(pathIndex);
        setSelectedDetails(getItemDetails(clickedItem, selectedDetails?.path || []));
      } else {
        setSelectedPathIndex(null);
        const newColumns = columns.slice(0, pathIndex + 1);
        
        if (clickedItem.type === 'folder' && clickedItem.children?.length) {
          newColumns[pathIndex] = { ...newColumns[pathIndex], selectedItem: clickedItem };
          newColumns.push({ items: clickedItem.children, selectedItem: null });
        } else {
          newColumns[pathIndex] = { ...newColumns[pathIndex], selectedItem: clickedItem };
        }
        
        // Calculate path from columns only
        const path = newColumns.map((col: ColumnData) => col.selectedItem?.name || '').filter(Boolean);
        
        setColumns(newColumns);
        setSelectedDetails(getItemDetails(clickedItem, path));
      }
    }
  };

  const handleViewMore = () => {
    if (selectedDetails) {
      const path = selectedDetails.path.join('/');
      navigate(`/attribute/${path}`);
    }
  };

  const renderColumn = (column: ColumnData, columnIndex: number) => (
    <Box
      key={columnIndex}
      sx={{
        width: 280,
        flex: '0 0 280px',
        borderRight: columnIndex < columns.length - 1 ? '1px solid' : 'none',
        borderColor: alpha(theme.palette.divider, 0.08),
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        transform: animatingColumns.includes(columnIndex) ? 'translateX(0)' : 'translateX(0)',
        opacity: animatingColumns.includes(columnIndex) ? 1 : 1,
        animation: animatingColumns.includes(columnIndex) ? 'slideIn 0.2s ease-in-out' : 'none',
        '@keyframes slideIn': {
          '0%': {
            transform: 'translateX(20px)',
            opacity: 0
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: 1
          }
        }
      }}
    >
      <List sx={{ 
        flex: 1, 
        overflow: 'auto',
        overflowX: 'hidden',
        py: 1,
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: alpha('#000', 0.08),
          borderRadius: 2,
          '&:hover': { backgroundColor: alpha('#000', 0.15) }
        }
      }}>
        {column.items.map((item) => (
          <ListItem
            key={item.name}
            onClick={() => handleItemClick(item, columnIndex)}
            sx={{
              cursor: 'pointer',
              py: 1.5,
              px: 2,
              transition: 'all 0.2s ease-in-out',
              backgroundColor: column.selectedItem?.name === item.name ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
              borderLeft: column.selectedItem?.name === item.name ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
              borderRadius: '8px',
              mx: 1,
              '&:hover': {
                backgroundColor: column.selectedItem?.name === item.name ? alpha(theme.palette.primary.main, 0.04) : alpha('#f5f5f5', 0.5),
                transform: 'translateX(2px)'
              },
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 32,
              color: column.selectedItem?.name === item.name ? theme.palette.primary.main : alpha('#000', 0.5),
              transition: 'all 0.2s ease-in-out'
            }}>
              {item.type === 'folder' ? (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  transition: 'transform 0.2s ease-in-out',
                  transform: column.selectedItem?.name === item.name ? 'scale(1.1)' : 'scale(1)'
                }}>
                  {column.selectedItem?.name === item.name ? <FolderOpenIcon sx={{ fontSize: 20 }} /> : <FolderIcon sx={{ fontSize: 20 }} />}
                  <ChevronRightIcon sx={{ 
                    ml: 0.5, 
                    fontSize: 16,
                    opacity: 0.7,
                    transition: 'transform 0.2s ease-in-out',
                    transform: column.selectedItem?.name === item.name ? 'rotate(90deg)' : 'rotate(0deg)'
                  }} />
                </Box>
              ) : (
                <InsertDriveFileIcon sx={{ fontSize: 20 }} />
              )}
            </ListItemIcon>
            <ListItemText 
              primary={item.name}
              sx={{
                '& .MuiTypography-root': {
                  color: column.selectedItem?.name === item.name ? theme.palette.primary.main : alpha('#000', 0.7),
                  transition: 'all 0.2s ease-in-out',
                  fontSize: '0.875rem',
                  fontWeight: item.type === 'folder' ? 500 : 400,
                  lineHeight: 1.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const renderPath = (ref: React.RefObject<HTMLDivElement | null>, isClickable: boolean = true, isDetailsPanelPath: boolean = false) => (
    <Box
      ref={ref}
      sx={{ 
        display: 'flex',
        overflowX: 'auto',
        py: isDetailsPanelPath ? 1.5 : 0.5,
        px: isDetailsPanelPath ? 2 : 0,
        pl: isDetailsPanelPath ? 2 : 0.8,
        bgcolor: isDetailsPanelPath ? alpha('#f8f9fa', 0.8) : 'white',
        borderBottom: isDetailsPanelPath ? '1px solid' : 'none',
        borderColor: 'divider',
        position: 'relative',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',  // Firefox
        msOverflowStyle: 'none',  // IE and Edge
        ...(isDetailsPanelPath && {
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -1,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 100%)'
          }
        })
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        ...(isDetailsPanelPath && {
          '&::before': {
            content: '"Path:"',
            color: '#666666',
            fontSize: '0.75rem',
            fontWeight: 500,
            marginRight: 1.5,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }
        })
      }}>
        {selectedDetails?.path?.map((item: string, index: number) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRightIcon 
                sx={{ 
                  mx: 0.25,
                  fontSize: isDetailsPanelPath ? 18 : 16,
                  color: isDetailsPanelPath ? alpha('#666666', 0.5) : '#666666',
                  verticalAlign: 'middle'
                }} 
              />
            )}
            <Box
              onClick={() => isClickable && handlePathClick(index, isDetailsPanelPath)}
              sx={{
                py: 0.5,
                px: 1,
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                color: index === (selectedDetails?.path?.length ?? 0) - 1 
                  ? '#0066cc' 
                  : isDetailsPanelPath 
                    ? '#1a1a1a'
                    : '#666666',
                fontWeight: index === (selectedDetails?.path?.length ?? 0) - 1 ? 600 : 400,
                fontSize: isDetailsPanelPath ? '0.875rem' : '0.8125rem',
                cursor: isClickable ? 'pointer' : 'default',
                backgroundColor: isDetailsPanelPath && selectedPathIndex === index ? alpha('#0066cc', 0.08) : 'transparent',
                border: isDetailsPanelPath && selectedPathIndex === index ? '1px solid' : '1px solid transparent',
                borderColor: isDetailsPanelPath && selectedPathIndex === index ? alpha('#0066cc', 0.2) : 'transparent',
                borderRadius: '4px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': isClickable ? {
                  color: '#0066cc',
                  backgroundColor: alpha('#0066cc', 0.04),
                  ...(isDetailsPanelPath && {
                    transform: 'translateY(-1px)',
                    boxShadow: `0 2px 4px ${alpha('#000', 0.05)}`
                  })
                } : {},
                ...(isDetailsPanelPath && {
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  '&::before': {
                    content: index === 0 ? '"📁"' : 
                             index === (selectedDetails?.path?.length ?? 0) - 1 ? '"📄"' : '"📂"',
                    fontSize: '1rem',
                    opacity: 0.8
                  }
                })
              }}
            >
              {item}
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );

  const renderDetailsPanel = () => {
    if (!selectedDetails) {
      return null;
    }

    return (
      <Paper sx={{ 
        width: 320,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
      }}>
        {/* Path Navigation with enhanced styling */}
        {selectedDetails?.path?.length > 0 && renderPath(detailsPathScrollRef, true, true)}

        {/* Details Content */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          p: 2
        }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px',
              color: alpha('#000', 0.5)
            }}>
              Description
            </Typography>
            <Typography variant="body2" sx={{ 
              color: alpha('#000', 0.7), 
              fontSize: '0.875rem', 
              lineHeight: 1.6 
            }}>
              {selectedDetails.description}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px',
              color: alpha('#000', 0.5)
            }}>
              Status
            </Typography>
            <Chip
              label={selectedDetails.status}
              size="small"
              sx={{
                backgroundColor: selectedDetails.status === 'Active' 
                  ? alpha(theme.palette.success.main, 0.1)
                  : alpha(theme.palette.warning.main, 0.1),
                color: selectedDetails.status === 'Active'
                  ? theme.palette.success.main
                  : theme.palette.warning.main,
                fontWeight: 500,
                '& .MuiChip-label': {
                  px: 1.5,
                  fontSize: '0.75rem'
                }
              }}
            />
          </Box>

          {selectedDetails.type === 'folder' ? (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.5px',
                  color: alpha('#000', 0.5)
                }}>
                  Usage Count
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: alpha('#000', 0.7), 
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <BarChartIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                  {selectedDetails.usageCount?.toLocaleString()} references
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.5px',
                  color: alpha('#000', 0.5)
                }}>
                  Data Type
                </Typography>
                <Chip
                  label={selectedDetails.dataType}
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

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.5px',
                  color: alpha('#000', 0.5)
                }}>
                  Value
                </Typography>
                <Typography variant="body2" sx={{ 
                  wordBreak: 'break-all',
                  backgroundColor: alpha('#f5f5f5', 0.5),
                  p: 1.5,
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  color: alpha('#000', 0.7),
                  lineHeight: 1.5
                }}>
                  {JSON.stringify(selectedDetails.value, null, 2)}
                </Typography>
              </Box>
            </>
          )}

          <Divider sx={{ my: 2, opacity: 0.08 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px',
              color: alpha('#000', 0.5)
            }}>
              Owner
            </Typography>
            <Typography variant="body2" sx={{ 
              color: alpha('#000', 0.7), 
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <PersonIcon sx={{ fontSize: 16, color: alpha('#000', 0.5) }} />
              {selectedDetails.owner}
            </Typography>
          </Box>

          <Box sx={{ mb: selectedDetails.type === 'file' ? 3 : 0 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px',
              color: alpha('#000', 0.5)
            }}>
              Last Modified
            </Typography>
            <Typography variant="body2" sx={{ 
              color: alpha('#000', 0.7), 
              fontSize: '0.875rem' 
            }}>
              {selectedDetails.lastModified}
            </Typography>
          </Box>

          {/* Show View More button only for attributes (files) */}
          {selectedDetails.type === 'file' && (
            <Button
              variant="contained"
              size="small"
              onClick={handleViewMore}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                boxShadow: 'none',
                mt: 1,
                fontSize: '0.875rem',
                py: 1,
                px: 2,
                '&:hover': {
                  boxShadow: 'none',
                }
              }}
            >
              View More Details
            </Button>
          )}
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
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
          zIndex: 1200,
          display: isSearchExpanded ? 'flex' : 'none',
          alignItems: 'flex-start',
          justifyContent: 'center',
          pt: '15vh',
          opacity: isSearchExpanded ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          animation: isSearchExpanded ? 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
            },
            '100%': {
              opacity: 1,
            }
          }
        }}
        onClick={() => setIsSearchExpanded(false)}
      >
        <Box
          sx={{
            width: '90%',
            maxWidth: '1000px',
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
            placeholder="Search attributes, events, or values..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
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
              },
              animation: isSearchExpanded ? 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                },
                '100%': {
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
              '0%': {
                opacity: 0,
              },
              '100%': {
                opacity: 1,
              }
            }
          }}>
            {searchQuery.trim() ? (
              searchResults.length > 0 ? (
                <List>
                  {searchResults.map((result: TreeNode, index: number) => (
                    <ListItem
                      key={index}
                      onClick={() => navigateToSearchResult(result)}
                      sx={{
                        cursor: 'pointer',
                        py: 1.5,
                        px: 2,
                        transition: 'all 0.2s ease-in-out',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.04),
                          transform: 'translateX(2px)'
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        minWidth: 32,
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
                            fontSize: '0.875rem',
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
              ) : (
                <Box sx={{ 
                  p: 3, 
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
                p: 3, 
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

      <Box sx={{ 
        p: '16px 24px', 
        flexShrink: 0,
        backgroundColor: 'white',
        borderBottom: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.08),
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%'
        }}>
          <ToggleButtonGroup
            value={tabValue}
            exclusive
            onChange={handleNavigationChange}
            aria-label="navigation type"
            sx={{
              justifyContent: 'flex-start',
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                px: 2,
                py: 1,
                border: 'none',
                borderRadius: '8px',
                mx: 0,
                mr: 1,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  }
                },
                '&:hover': {
                  backgroundColor: alpha('#000', 0.04),
                }
              }
            }}
          >
            {navigationOptions.map((option, index) => (
              <ToggleButton key={index} value={index} aria-label={option.label}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {option.icon}
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {option.label}
                  </Typography>
                </Box>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          
          <TextField
            placeholder="Search..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            onClick={() => setIsSearchExpanded(true)}
            size="small"
            sx={{
              width: '500px',
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
        </Box>
      </Box>

      {/* Content Area */}
      <Box sx={{ 
        flex: 1, 
        minHeight: 0, 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        p: '16px 24px',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', gap: 2, flex: 1, minHeight: 0 }}>
          {/* Navigation Columns */}
          <Box sx={{ 
            flex: 1,
            backgroundColor: 'white',
            overflow: 'hidden',
            display: 'flex',
            borderRadius: '12px',
            boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
          }}>
            <Box 
              ref={scrollContainerRef}
              sx={{ 
                flex: 1,
                display: 'flex',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': { height: 4 },
                '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
                '&::-webkit-scrollbar-thumb': { 
                  backgroundColor: alpha('#000', 0.08),
                  borderRadius: 2,
                  '&:hover': { backgroundColor: alpha('#000', 0.15) }
                }
              }}
            >
              {columns.map((column: ColumnData, index: number) => renderColumn(column, index))}
              {columns.length === 1 && (
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    color: alpha('#000', 0.4),
                    flexDirection: 'column',
                    gap: 1.5,
                    p: 4
                  }}
                >
                  <FolderIcon sx={{ fontSize: 40, color: alpha('#000', 0.12) }} />
                  <Typography variant="h6" sx={{ 
                    color: alpha('#000', 0.6),
                    fontWeight: 500,
                  }}>
                    No Items Selected
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ 
                    maxWidth: 300,
                    color: alpha('#000', 0.4),
                    fontSize: '0.875rem',
                    lineHeight: 1.5
                  }}>
                    Select a folder to explore its contents and view detailed information
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Details Panel */}
          {renderDetailsPanel()}
        </Box>
      </Box>
    </Box>
  );
};

export default DataWizard; 