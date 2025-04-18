import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Avatar,
  Badge,
  Fade,
  Zoom,
  useMediaQuery,
  Collapse,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import CodeIcon from '@mui/icons-material/Code';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LabelIcon from '@mui/icons-material/Label';
import SecurityIcon from '@mui/icons-material/Security';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import StorageIcon from '@mui/icons-material/Storage';
import SpeedIcon from '@mui/icons-material/Speed';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TransformIcon from '@mui/icons-material/Transform';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MergeIcon from '@mui/icons-material/Merge';
import { useNavigate, useLocation } from 'react-router-dom';
import { userData } from '../../data/userData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';

interface AttributeDetailsProps {
  attributePath?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface AttributeMetadata {
  name: string;
  path: string[];
  value: any;
  dataType: string;
  xdmPath: string;
  description: string;
  status: string;
  owner: string;
  lastModified: string;
  privacyLevel: string;
  retentionPeriod: string;
  usageCount?: number;
  tags?: string[];
  // New fields
  dataClassification: string;
  displayName: string;
  definition: string;
  sampleValues: any[];
  allPossibleValues: any[];
  xdmSchema: string;
  xdmFieldGroup: string;
  xdmDataType: string;
  latency: string;
  identity: string;
  historicalDataEnabled: boolean;
  dataSteward: string;
  dataSource: string;
  aepDatasets: string[];
  sampleSnapshotQuery: string;
}

interface IntermediateTable {
  name: string;
  description: string;
  rowCount: number;
}

interface TableColumn {
  name: string;
  type: string;
  isKey?: boolean;
}

interface TableNode {
  name: string;
  type: 'source' | 'intermediate' | 'destination';
  x?: number;
  y?: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`attribute-tabpanel-${index}`}
      aria-labelledby={`attribute-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface MetadataItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const MetadataItem: React.FC<MetadataItemProps> = ({ icon, label, value }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box sx={{ mr: 2, color: 'primary.main' }}>{icon}</Box>
      <Box>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="body1">{value}</Typography>
      </Box>
    </Box>
  );
};

// Add new layout type
type LayoutType = 'minimal' | 'split-panel' | 'cards' | 'dashboard' | 'focus' | 'compact';

interface UsageChartProps {
  data: Array<{ date: string; count: number }>;
  height?: number | string;
}

const UsageChart: React.FC<UsageChartProps> = ({ data, height = 300 }) => (
  <Box sx={{ height }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.1)} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: alpha('#000', 0.2) }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: alpha('#000', 0.2) }}
        />
        <RechartsTooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#0066cc" 
          strokeWidth={2}
          dot={{ fill: '#0066cc', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#0066cc' }}
        />
      </LineChart>
    </ResponsiveContainer>
  </Box>
);

// Add new interfaces for lineage visualization
interface LineageNode {
  id: string;
  name: string;
  type: 'source' | 'intermediate' | 'target';
  description: string;
  x: number;
  y: number;
  columns: string[];
}

interface LineageConnection {
  from: string;
  to: string;
  type: 'direct' | 'transformed' | 'filtered' | 'merged' | 'split';
  description: string;
}

// Update the LineageFlow component
const LineageFlow: React.FC = () => {
  // Sample lineage data with adjusted positions
  const nodes: LineageNode[] = [
    {
      id: 'source1',
      name: 'User_Profile_Data',
      type: 'source',
      description: 'Raw user profile data from CRM system',
      x: 50,
      y: 50,
      columns: ['user_id', 'name', 'email', 'country', 'created_at']
    },
    {
      id: 'source2',
      name: 'Email_Verification_Data',
      type: 'source',
      description: 'Email verification status from authentication service',
      x: 50,
      y: 250,
      columns: ['user_id', 'email', 'verified', 'verification_date']
    },
    {
      id: 'source3',
      name: 'User_Behavior_Data',
      type: 'source',
      description: 'User activity and behavior data',
      x: 50,
      y: 450,
      columns: ['user_id', 'last_login', 'login_count', 'preferences']
    },
    {
      id: 'intermediate1',
      name: 'User_Segmentation_Data',
      type: 'intermediate',
      description: 'Processed user segmentation data',
      x: 450,
      y: 100,
      columns: ['user_id', 'segment', 'segment_score', 'last_updated']
    },
    {
      id: 'intermediate2',
      name: 'User_Enrichment_Data',
      type: 'intermediate',
      description: 'Enriched user data with additional attributes',
      x: 450,
      y: 300,
      columns: ['user_id', 'enriched_attributes', 'enrichment_date']
    },
    {
      id: 'target',
      name: 'User_Attributes',
      type: 'target',
      description: 'Final user attributes for AEP',
      x: 850,
      y: 200,
      columns: ['user_id', 'attributes', 'last_updated']
    }
  ];
  
  const connections: LineageConnection[] = [
    {
      from: 'source1',
      to: 'intermediate1',
      type: 'transformed',
      description: 'Transform user profile data for segmentation'
    },
    {
      from: 'source2',
      to: 'intermediate2',
      type: 'transformed',
      description: 'Enrich with email verification data'
    },
    {
      from: 'source3',
      to: 'intermediate2',
      type: 'transformed',
      description: 'Enrich with user behavior data'
    },
    {
      from: 'intermediate1',
      to: 'target',
      type: 'merged',
      description: 'Merge segmentation data with enriched attributes'
    },
    {
      from: 'intermediate2',
      to: 'target',
      type: 'merged',
      description: 'Merge enriched data with segmentation data'
    }
  ];

  return (
    <Box sx={{ 
      position: 'relative', 
      height: 700,
      width: '1400px', // Set a minimum width to ensure all nodes are visible
      minWidth: '100%'  // Ensure it takes at least full width of container
    }}>
      {/* Connections */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {connections.map((connection, index) => {
          const fromNode = nodes.find(node => node.id === connection.from);
          const toNode = nodes.find(node => node.id === connection.to);
          
          if (!fromNode || !toNode) return null;
          
          const fromX = fromNode.x + 280;
          const fromY = fromNode.y + 50;
          const toX = toNode.x;
          const toY = toNode.y + 50;
          
          const path = `M ${fromX} ${fromY} 
                       C ${fromX + 100} ${fromY}, 
                         ${toX - 100} ${toY}, 
                         ${toX} ${toY}`;
          
          return (
            <path
              key={index}
              d={path}
              stroke={connection.type === 'merged' ? '#00A76F' : '#0066CC'}
              strokeWidth={1.5}
              fill="none"
              strokeDasharray={connection.type === 'transformed' ? '5,5' : 'none'}
              style={{ opacity: 0.6 }}
            />
          );
        })}
      </svg>
      
      {/* Nodes */}
      {nodes.map((node) => (
        <Paper
          key={node.id}
          elevation={0}
          sx={{
            position: 'absolute',
            left: node.x,
            top: node.y,
            width: 280,
            backgroundColor: '#FFFFFF',
            border: '1px solid',
            borderColor: alpha(
              node.type === 'source' ? '#0066CC' :
              node.type === 'intermediate' ? '#9B5DE5' : '#00A76F',
              0.2
            ),
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1.5,
            borderBottom: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.05)',
            color: node.type === 'source' ? '#0066CC' :
                   node.type === 'intermediate' ? '#9B5DE5' : '#00A76F'
          }}>
            <StorageIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ 
              fontSize: '0.875rem',
              fontWeight: 600,
              lineHeight: 1
            }}>
              {node.name}
            </Typography>
          </Box>
          
          {/* Content */}
          <Box sx={{ p: 1.5 }}>
            <Typography sx={{ 
              fontSize: '0.75rem',
              color: 'rgba(0, 0, 0, 0.6)',
              mb: 1.5,
              lineHeight: 1.4
            }}>
              {node.description}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 0.75 
            }}>
              {node.columns.map((column, idx) => (
                <Chip
                  key={idx}
                  label={column}
                  size="small"
                  sx={{
                    height: 20,
                    backgroundColor: alpha(
                      node.type === 'source' ? '#0066CC' :
                      node.type === 'intermediate' ? '#9B5DE5' : '#00A76F',
                      0.04
                    ),
                    color: node.type === 'source' ? '#0066CC' :
                           node.type === 'intermediate' ? '#9B5DE5' : '#00A76F',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      px: 1,
                      py: 0.25
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<AttributeMetadata>) => void;
  initialData: Partial<AttributeMetadata>;
}

const EditDialog: React.FC<EditDialogProps> = ({ open, onClose, onSave, initialData }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<Partial<AttributeMetadata>>({
    description: initialData.description || 'This attribute represents the user\'s profile information including personal details and preferences.',
    latency: initialData.latency || '100ms',
    tags: initialData.tags || ['user-profile', 'personal-data', 'preferences']
  });
  const [tagInput, setTagInput] = useState('');

  const handleChange = (field: keyof AttributeMetadata) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        color: alpha('#000', 0.8),
        fontWeight: 500
      }}>
        Edit Attribute Details
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Description Field */}
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={formData.description || ''}
            onChange={handleChange('description')}
            sx={{ mb: 3 }}
          />

          {/* Latency Field */}
          <TextField
            fullWidth
            label="Latency"
            value={formData.latency || ''}
            onChange={handleChange('latency')}
            sx={{ mb: 3 }}
          />

          {/* Tags Field */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: alpha('#000', 0.7) }}>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              {formData.tags?.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    '& .MuiChip-deleteIcon': {
                      color: theme.palette.primary.main,
                      '&:hover': {
                        color: theme.palette.primary.dark,
                      }
                    }
                  }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                variant="contained"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                sx={{
                  minWidth: '100px',
                  borderRadius: '8px',
                  textTransform: 'none'
                }}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: alpha('#000', 0.6),
            '&:hover': {
              backgroundColor: alpha('#000', 0.04)
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave(formData)}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            px: 3
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AttributeDetails: React.FC<AttributeDetailsProps> = ({ attributePath }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tabValue, setTabValue] = useState<number>(0);
  const [attributeData, setAttributeData] = useState<AttributeMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    metadata: true,
    value: true,
    related: true
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<AttributeMetadata>>({});
  const [valueType, setValueType] = useState<'sample' | 'all'>('sample');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  // Usage data
  const [usageData] = useState(() => {
    const data = [
      { date: '2024-01', count: 1500 },
      { date: '2024-02', count: 2200 },
      { date: '2024-03', count: 1800 },
      { date: '2024-04', count: 2400 },
      { date: '2024-05', count: 3000 },
      { date: '2024-06', count: 2800 },
    ];
    return data;
  });
  
  // Platform usage data
  const [platformData] = useState([
    { platform: 'Desktop', usage: 4500 },
    { platform: 'Web', usage: 3200 },
    { platform: 'Mobile', usage: 2300 },
  ]);
  
  // OS usage data
  const [osData] = useState([
    { name: 'Mac', value: 4000 },
    { name: 'Windows', value: 3500 },
    { name: 'iOS', value: 1500 },
    { name: 'Android', value: 1000 },
  ]);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Related attributes data
  const [relatedAttributes] = useState([
    { name: 'user.email', usageCount: 12500, correlation: 85 },
    { name: 'user.name', usageCount: 9800, correlation: 72 },
    { name: 'user.country', usageCount: 7500, correlation: 65 },
    { name: 'user.language', usageCount: 6200, correlation: 58 },
  ]);
  
  // Campaign usage data
  const [campaignUsage] = useState([
    { name: 'Summer Promotion 2023', segmentCount: 8, status: 'Active' },
    { name: 'Holiday Special 2023', segmentCount: 12, status: 'Active' },
    { name: 'New Product Launch', segmentCount: 5, status: 'Scheduled' },
    { name: 'Customer Retention', segmentCount: 7, status: 'Active' },
  ]);
  
  // Handle time range change
  const handleTimeRangeChange = (_: React.MouseEvent<HTMLElement>, newTimeRange: '7d' | '30d' | '90d' | null) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  // Add intermediate tables data
  const intermediateTables: IntermediateTable[] = [
    {
      name: 'Raw_User_Data',
      description: 'Initial data collection from various sources',
      rowCount: 1250000
    },
    {
      name: 'Processed_Data',
      description: 'Cleaned and validated data',
      rowCount: 980000
    },
    {
      name: 'Enriched_Data',
      description: 'Data with additional computed attributes',
      rowCount: 980000
    }
  ];

  // Add table nodes data
  const tableNodes: TableNode[] = [
    {
      name: 'User_Profile_Data',
      type: 'source',
      x: 50,
      y: 50
    },
    {
      name: 'Email_Verification_Data',
      type: 'source',
      x: 50,
      y: 150
    },
    {
      name: 'User_Behavior_Data',
      type: 'source',
      x: 50,
      y: 250
    },
    {
      name: 'User_Segmentation_Data',
      type: 'intermediate',
      x: 350,
      y: 100
    },
    {
      name: 'User_Enrichment_Data',
      type: 'intermediate',
      x: 350,
      y: 200
    },
    {
      name: 'User_Attributes',
      type: 'destination',
      x: 650,
      y: 150
    }
  ];

  useEffect(() => {
    const fetchAttributeDetails = () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get the path from the URL, removing the leading slash
        const fullPath = location.pathname;
        const pathWithoutPrefix = fullPath.replace('/attribute/', '');
        const pathSegments = pathWithoutPrefix ? pathWithoutPrefix.split('/') : attributePath?.split('/') || [];
        
        // Find the attribute in the userData
        let currentData: any = userData;
        for (const segment of pathSegments) {
          if (currentData && typeof currentData === 'object' && segment in currentData) {
            currentData = currentData[segment];
          } else {
            throw new Error(`Attribute not found: ${pathWithoutPrefix}`);
          }
        }
        
        // Generate metadata for the attribute
        const metadata: AttributeMetadata = {
          name: pathSegments[pathSegments.length - 1],
          path: pathSegments,
          value: currentData,
          dataType: typeof currentData === 'string' ? 'String' :
                   typeof currentData === 'number' ? 'Number' :
                   typeof currentData === 'boolean' ? 'Boolean' :
                   Array.isArray(currentData) ? 'Array' : 'Object',
          xdmPath: pathSegments.join('.'),
          description: getAttributeDescription(pathSegments[pathSegments.length - 1]),
          status: Math.random() > 0.1 ? 'Active' : 'Deprecated',
          owner: ['Priya Shanmugan', 'John Smith', 'Sarah Chen', 'Mike Johnson'][Math.floor(Math.random() * 4)],
          lastModified: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
          privacyLevel: 'High',
          retentionPeriod: '3 years',
          usageCount: Math.floor(Math.random() * 10000) + 5000,
          tags: ['sensitive', 'personal', 'user-generated'],
          // New fields
          dataClassification: 'Core',
          displayName: 'User Data',
          definition: 'Data related to user profiles',
          sampleValues: generateSampleValues(currentData),
          allPossibleValues: generateAllPossibleValues(currentData),
          xdmSchema: 'UserProfileSchema',
          xdmFieldGroup: 'UserProfile',
          xdmDataType: 'Object',
          latency: '100ms',
          identity: 'User ID',
          historicalDataEnabled: true,
          dataSteward: 'Data Steward',
          dataSource: 'Data Source',
          aepDatasets: ['UserProfileDataset'],
          sampleSnapshotQuery: 'SELECT * FROM UserProfile WHERE userId = ?'
        };
        
        setAttributeData(metadata);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load attribute details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttributeDetails();
  }, [location.pathname, attributePath]);

  const getAttributeDescription = (attributeName: string): string => {
    const descriptions: Record<string, string> = {
      'mostRecentOSVersion': 'The most recent operating system version recorded for this user on this platform.',
      'firstname': 'The user\'s first name as provided during registration.',
      'lastname': 'The user\'s last name as provided during registration.',
      'countryCode': 'The ISO country code for the user\'s location.',
      'address': 'The user\'s email address.',
      'isAdobeEmployee': 'Indicates whether the user is an Adobe employee.',
      'emailDomain': 'The domain portion of the user\'s email address.',
      'emailValidFlag': 'Indicates if the email address is valid.',
      'hashedEmail': 'A hashed version of the email address for security.',
      'modelScore': 'The numerical score from the predictive model.',
      'modelPercentileScore': 'The percentile rank of the model score.',
      'modelScoreDate': 'The date when the model score was calculated.',
      'modelUserSegment': 'The user segment assigned based on the model score.',
    };
    
    return descriptions[attributeName] || 'A structured identifier used for data organization and management.';
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const renderValuePreview = (value: any, dataType: string) => {
    if (dataType === 'Object' && value !== null) {
      return (
        <Box sx={{ 
          maxHeight: '200px', 
          overflow: 'auto',
          backgroundColor: alpha('#f5f5f5', 0.5),
          p: 1,
          borderRadius: 1,
          fontSize: '0.875rem',
          fontFamily: 'monospace'
        }}>
          <pre>{JSON.stringify(value, null, 2)}</pre>
        </Box>
      );
    }
    
    return (
      <Typography variant="body2" sx={{ 
        wordBreak: 'break-all',
        backgroundColor: alpha('#f5f5f5', 0.5),
        p: 1,
        borderRadius: 1,
        fontSize: '0.875rem',
        fontFamily: 'monospace'
      }}>
        {JSON.stringify(value)}
      </Typography>
    );
  };

  const handleExpandSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    // Menu click handler implementation
  };

  const handleDrawerToggle = () => {
    // Drawer toggle handler implementation
  };

  const handleSpeedDialToggle = () => {
    // Speed dial toggle handler implementation
  };

  const handleEditClick = () => {
    if (attributeData) {
      setEditFormData({
        description: attributeData.description || '',
        tags: attributeData.tags || [],
        latency: attributeData.latency || '',
        displayName: attributeData.displayName || '',
        definition: attributeData.definition || '',
        dataClassification: attributeData.dataClassification || '',
        dataSteward: attributeData.dataSteward || '',
        dataSource: attributeData.dataSource || ''
      });
      setEditDialogOpen(true);
    }
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditSave = (data: Partial<AttributeMetadata>) => {
    if (attributeData) {
      setAttributeData({
        ...attributeData,
        ...data
      });
    }
    setEditDialogOpen(false);
  };

  const generateSampleValues = (value: any): any[] => {
    if (typeof value === 'string') {
      return [value, `Sample ${value}`, `${value} Example`];
    } else if (typeof value === 'number') {
      return [value, value + 1, value - 1];
    } else if (typeof value === 'boolean') {
      return [value, !value];
    } else if (Array.isArray(value)) {
      return [value.slice(0, 3), value.slice(3, 6), value.slice(6, 9)];
    } else if (typeof value === 'object' && value !== null) {
      return [value, { ...value, sample: true }, { ...value, example: true }];
    }
    return [value];
  };

  const generateAllPossibleValues = (value: any): any[] => {
    if (typeof value === 'string') {
      return ['value1', 'value2', 'value3', 'value4', 'value5'];
    } else if (typeof value === 'number') {
      return [0, 1, 2, 3, 4, 5];
    } else if (typeof value === 'boolean') {
      return [true, false];
    } else if (Array.isArray(value)) {
      return [value, [...value, 'additional'], [...value, 'more']];
    } else if (typeof value === 'object' && value !== null) {
      return [value, { ...value, option1: true }, { ...value, option2: true }];
    }
    return [value];
  };

  const renderContent = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Usage Statistics
      </Typography>
      
      {/* Statistics Cards */}
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        mb: 4
      }}>
        <Paper sx={{ 
          flex: 1,
          p: 3,
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid',
          borderColor: 'divider',
        }}>
          <Typography variant="h3" sx={{ 
            color: '#0066cc',
            fontSize: '2.5rem',
            fontWeight: 600,
            mb: 1
          }}>
            {(attributeData?.usageCount ? Math.floor(attributeData.usageCount / 10) : 0).toLocaleString()}
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            color: '#666666',
            fontWeight: 500,
            mb: 0.5
          }}>
            Total Segments
          </Typography>
          <Typography variant="body2" sx={{ color: '#888888' }}>
            Across all systems and applications
          </Typography>
        </Paper>

        <Paper sx={{ 
          flex: 1,
          p: 3,
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid',
          borderColor: 'divider',
        }}>
          <Typography variant="h3" sx={{ 
            color: '#2e7d32',
            fontSize: '2.5rem',
            fontWeight: 600,
            mb: 1
          }}>
            {(attributeData?.usageCount ? Math.floor(attributeData.usageCount * 0.1) : 0).toLocaleString()}
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            color: '#666666',
            fontWeight: 500,
            mb: 0.5
          }}>
            Last 30 Days
          </Typography>
          <Typography variant="body2" sx={{ color: '#888888' }}>
            Active usage in the past month
          </Typography>
        </Paper>
      </Box>
      
      {/* Top Segments Table */}
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Top Segments Using This Attribute
      </Typography>
      <Paper sx={{ 
        p: 3,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid',
        borderColor: 'divider',
        mb: 4
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: alpha('#000', 0.7) }}>Segment Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: alpha('#000', 0.7) }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600, color: alpha('#000', 0.7) }}>Profile Count</TableCell>
                <TableCell sx={{ fontWeight: 600, color: alpha('#000', 0.7) }}>Last Updated</TableCell>
                <TableCell sx={{ fontWeight: 600, color: alpha('#000', 0.7) }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                {
                  name: 'High-Value Customers',
                  description: 'Customers with lifetime value above $10,000',
                  profileCount: 12500,
                  lastUpdated: '2023-05-15',
                  status: 'Active'
                },
                {
                  name: 'Product Abandoners',
                  description: 'Users who abandoned products in cart',
                  profileCount: 8750,
                  lastUpdated: '2023-06-02',
                  status: 'Active'
                },
                {
                  name: 'Subscription Renewal',
                  description: 'Users with subscriptions expiring in 30 days',
                  profileCount: 6200,
                  lastUpdated: '2023-05-28',
                  status: 'Active'
                },
                {
                  name: 'Feature Adopters',
                  description: 'Users who adopted new features in last 90 days',
                  profileCount: 5400,
                  lastUpdated: '2023-06-10',
                  status: 'Active'
                },
                {
                  name: 'Inactive Users',
                  description: 'Users with no activity in last 60 days',
                  profileCount: 4800,
                  lastUpdated: '2023-05-20',
                  status: 'Active'
                }
              ].map((segment, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontWeight: 500, color: alpha('#000', 0.8) }}>{segment.name}</TableCell>
                  <TableCell sx={{ color: alpha('#000', 0.7) }}>{segment.description}</TableCell>
                  <TableCell sx={{ color: alpha('#000', 0.7) }}>{segment.profileCount.toLocaleString()}</TableCell>
                  <TableCell sx={{ color: alpha('#000', 0.7) }}>{segment.lastUpdated}</TableCell>
                  <TableCell>
                    <Chip 
                      label={segment.status} 
                      size="small" 
                      color="success"
                      sx={{ 
                        backgroundColor: alpha('#2e7d32', 0.1),
                        color: '#2e7d32',
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Usage Timeline */}
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Usage Timeline
      </Typography>
      <Paper sx={{ 
        p: 3,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid',
        borderColor: 'divider',
        minHeight: 400,
      }}>
        <UsageChart data={usageData} height={400} />
      </Paper>
    </Box>
  );

  // Add a new function to render the lineage content
  const renderLineageContent = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Data Lineage
      </Typography>
      
      <Paper sx={{ 
        p: 3,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid',
        borderColor: 'divider',
        mb: 4,
        overflow: 'hidden'
      }}>
        <Typography variant="body1" sx={{ mb: 3, color: alpha('#000', 0.7) }}>
          This visualization shows how data flows from source tables to target tables, including transformations and relationships.
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3,
          flexWrap: 'wrap'
        }}>
          <Chip 
            icon={<StorageIcon />} 
            label="Source Tables" 
            sx={{ 
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 500
            }} 
          />
          <Chip 
            icon={<TransformIcon />} 
            label="Intermediate Tables" 
            sx={{ 
              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
              color: theme.palette.secondary.main,
              fontWeight: 500
            }} 
          />
          <Chip 
            icon={<StorageIcon />} 
            label="Target Tables" 
            sx={{ 
              backgroundColor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
              fontWeight: 500
            }} 
          />
          <Chip 
            icon={<TransformIcon />} 
            label="Transformation" 
            sx={{ 
              backgroundColor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.main,
              fontWeight: 500
            }} 
          />
          <Chip 
            icon={<MergeIcon />} 
            label="Merge" 
            sx={{ 
              backgroundColor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
              fontWeight: 500
            }} 
          />
        </Box>
        
        <Box sx={{ 
          overflowX: 'auto',
          overflowY: 'hidden',
          width: '100%',
          pb: 2
        }}>
          <LineageFlow />
        </Box>
      </Paper>
      
      <Paper sx={{ 
        p: 3,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid',
        borderColor: 'divider',
      }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Lineage Details
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: alpha('#000', 0.7) }}>Source</TableCell>
                <TableCell sx={{ fontWeight: 600, color: alpha('#000', 0.7) }}>Target</TableCell>
                <TableCell sx={{ fontWeight: 600, color: alpha('#000', 0.7) }}>Transformation</TableCell>
                <TableCell sx={{ fontWeight: 600, color: alpha('#000', 0.7) }}>Last Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                {
                  source: 'User_Profile_Data',
                  target: 'User_Segmentation_Data',
                  transformation: 'Filter and transform user profile data for segmentation',
                  lastUpdated: '2023-06-15'
                },
                {
                  source: 'Email_Verification_Data',
                  target: 'User_Enrichment_Data',
                  transformation: 'Enrich user data with email verification status',
                  lastUpdated: '2023-06-10'
                },
                {
                  source: 'User_Behavior_Data',
                  target: 'User_Enrichment_Data',
                  transformation: 'Enrich user data with behavior information',
                  lastUpdated: '2023-06-12'
                },
                {
                  source: 'User_Segmentation_Data, User_Enrichment_Data',
                  target: 'User_Attributes',
                  transformation: 'Merge segmentation and enriched data into final attributes',
                  lastUpdated: '2023-06-18'
                }
              ].map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ color: alpha('#000', 0.8) }}>{item.source}</TableCell>
                  <TableCell sx={{ color: alpha('#000', 0.8) }}>{item.target}</TableCell>
                  <TableCell sx={{ color: alpha('#000', 0.7) }}>{item.transformation}</TableCell>
                  <TableCell sx={{ color: alpha('#000', 0.7) }}>{item.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
        backgroundColor: alpha(theme.palette.background.default, 0.5)
      }}>
        <CircularProgress size={40} sx={{ color: theme.palette.primary.main }} />
            </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
          p: 4, 
          maxWidth: 600, 
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        textAlign: 'center',
        backgroundColor: alpha(theme.palette.background.default, 0.5)
      }}>
        <Alert 
          severity="error" 
          sx={{ 
            width: '100%', 
            mb: 3,
            '& .MuiAlert-icon': {
              fontSize: 32
            }
          }}
        >
          <Typography variant="h6" gutterBottom>
            {error}
            </Typography>
          <Typography variant="body2">
            We couldn't find the attribute you're looking for. It may have been moved or deleted.
          </Typography>
        </Alert>
          <Button 
            variant="contained" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
            sx={{ 
            mt: 2,
            px: 3,
            py: 1,
            borderRadius: '8px',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            }
            }}
          >
          Return to Data Wizard
          </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: alpha(theme.palette.background.default, 0.5)
    }}>
      {/* Header */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={handleBack} 
              sx={{ 
                color: alpha('#000', 0.6),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  color: theme.palette.primary.main
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ 
              color: alpha('#000', 0.8),
              fontWeight: 500
            }}>
              Attribute Details
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              startIcon={<EditIcon />}
              onClick={handleEditClick}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              Edit
            </Button>
            <Button 
              startIcon={<ShareIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              Share
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        minHeight: 0, 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        p: '8px',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', gap: 2, flex: 1, minHeight: 0 }}>
          {/* Left Panel - Overview */}
          <Paper sx={{ 
            width: 300,
            p: 2, 
            borderRight: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.08),
            overflow: 'auto',
            borderRadius: '12px',
            boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
          }}>
            <Typography variant="h6" sx={{ 
              mb: 2,
              color: alpha('#000', 0.8),
              fontWeight: 500
            }}>
              Overview
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ 
                color: alpha('#000', 0.8),
                fontWeight: 500
              }}>
                {attributeData?.displayName || attributeData?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ 
                color: alpha('#000', 0.6),
                fontSize: '0.875rem',
                lineHeight: 1.6
              }}>
                {attributeData?.definition || attributeData?.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {attributeData?.tags?.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
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
                ))}
              </Box>
            </Box>
            <Divider sx={{ mb: 2, opacity: 0.08 }} />

            {/* Key Information */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ 
                color: alpha('#000', 0.5),
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 1
              }}>
                Key Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Data Type</Typography>
                <Typography variant="body1" sx={{ 
                  color: alpha('#000', 0.7),
                  fontSize: '0.875rem'
                }}>
                  {attributeData?.dataType}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Chip
                  label={attributeData?.status}
                  size="small"
                  sx={{
                    backgroundColor: attributeData?.status === 'Active' 
                      ? alpha(theme.palette.success.main, 0.1)
                      : alpha(theme.palette.warning.main, 0.1),
                    color: attributeData?.status === 'Active'
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
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Data Classification</Typography>
                <Typography variant="body1" sx={{ 
                  color: alpha('#000', 0.7),
                  fontSize: '0.875rem'
                }}>
                  Core
                </Typography>
              </Box>
            </Box>

            {/* Ownership */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ 
                color: alpha('#000', 0.5),
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 1
              }}>
                Ownership
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Data Owner</Typography>
                <Typography variant="body1" sx={{ 
                  color: alpha('#000', 0.7),
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <PersonIcon sx={{ fontSize: 16, color: alpha('#000', 0.5) }} />
                  {attributeData?.owner}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Data Steward</Typography>
                <Typography variant="body1" sx={{ 
                  color: alpha('#000', 0.7),
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <PersonIcon sx={{ fontSize: 16, color: alpha('#000', 0.5) }} />
                  {attributeData?.dataSteward}
                </Typography>
              </Box>
            </Box>

            {/* Last Modified */}
            <Box>
              <Typography variant="caption" color="text.secondary">Last Modified</Typography>
              <Typography variant="body1" sx={{ 
                color: alpha('#000', 0.7),
                fontSize: '0.875rem'
              }}>
                {attributeData?.lastModified}
              </Typography>
            </Box>
          </Paper>

          {/* Right Panel - Content Tabs */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
          }}>
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: alpha(theme.palette.divider, 0.08),
              px: 2,
              mb: 2
            }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    minWidth: 120,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: alpha('#000', 0.6),
                    '&.Mui-selected': {
                      color: theme.palette.primary.main,
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.primary.main,
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  }
                }}
              >
                <Tab label="Metadata" />
                <Tab label="Usage" />
                <Tab label="Lineage" />
              </Tabs>
            </Box>

            {/* Tab Panels */}
            <Box sx={{ 
              px: 0,
              pb: 2,
              width: '100%'
            }}> 
              <TabPanel value={tabValue} index={0}>
                {/* Basic Information */}
                <Paper sx={{ 
                  p: 3, 
                  mb: 3,
                  borderRadius: '12px',
                  boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
                }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: alpha('#000', 0.8),
                    fontWeight: 500,
                    fontSize: '1rem',
                    mb: 2
                  }}>
                    Basic Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px',
                          color: alpha('#000', 0.5)
                        }}>
                          Data Type
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: alpha('#000', 0.7), 
                          fontSize: '0.875rem' 
                        }}>
                          {attributeData?.dataType}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px',
                          color: alpha('#000', 0.5)
                        }}>
                          Data Classification
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: alpha('#000', 0.7), 
                          fontSize: '0.875rem' 
                        }}>
                          {attributeData?.dataClassification}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px',
                          color: alpha('#000', 0.5)
                        }}>
                          Adobe GUID
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: alpha('#000', 0.7), 
                          fontSize: '0.875rem' 
                        }}>
                          {attributeData?.identity}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px',
                          color: alpha('#000', 0.5)
                        }}>
                          Latency
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: alpha('#000', 0.7), 
                          fontSize: '0.875rem' 
                        }}>
                          {attributeData?.latency}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px',
                          color: alpha('#000', 0.5)
                        }}>
                          Data Source
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: alpha('#000', 0.7), 
                          fontSize: '0.875rem' 
                        }}>
                          {attributeData?.dataSource}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px',
                          color: alpha('#000', 0.5)
                        }}>
                          Historical Data
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            label={attributeData?.historicalDataEnabled ? "Yes" : "No"}
                            size="small"
                            sx={{
                              backgroundColor: attributeData?.historicalDataEnabled 
                                ? alpha(theme.palette.success.main, 0.1)
                                : alpha(theme.palette.warning.main, 0.1),
                              color: attributeData?.historicalDataEnabled
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
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* XDM Information */}
                <Paper sx={{ 
                  p: 3, 
                  mb: 3,
                  borderRadius: '12px',
                  boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
                }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: alpha('#000', 0.8),
                    fontWeight: 500,
                    fontSize: '1rem',
                    mb: 2
                  }}>
                    XDM Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px',
                          color: alpha('#000', 0.5)
                        }}>
                          XDM Schema
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: alpha('#000', 0.7), 
                          fontSize: '0.875rem' 
                        }}>
                          {attributeData?.xdmSchema}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px',
                          color: alpha('#000', 0.5)
                        }}>
                          XDM Field Group
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: alpha('#000', 0.7), 
                          fontSize: '0.875rem' 
                        }}>
                          {attributeData?.xdmFieldGroup}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px',
                          color: alpha('#000', 0.5)
                        }}>
                          XDM Data Type
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: alpha('#000', 0.7), 
                          fontSize: '0.875rem' 
                        }}>
                          attribute
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px',
                          color: alpha('#000', 0.5)
                        }}>
                          XDM Path
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontFamily: 'monospace',
                          wordBreak: 'break-all',
                          whiteSpace: 'pre-wrap',
                          color: alpha('#000', 0.7),
                          fontSize: '0.875rem',
                          backgroundColor: alpha('#f5f5f5', 0.5),
                          p: 1.5,
                          borderRadius: '8px',
                          lineHeight: 1.5
                        }}>
                          {attributeData?.xdmPath}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Data Ownership */}
                <Paper sx={{ 
                  p: 3, 
                  mb: 3,
                  borderRadius: '12px',
                  boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
                }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: alpha('#000', 0.8),
                    fontWeight: 500,
                    fontSize: '1rem',
                    mb: 2
                  }}>
                    Data Ownership
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px',
                          color: alpha('#000', 0.5)
                        }}>
                          Data Owner
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: alpha('#000', 0.7), 
                          fontSize: '0.875rem' 
                        }}>
                          {attributeData?.owner}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px',
                          color: alpha('#000', 0.5)
                        }}>
                          Data Steward
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: alpha('#000', 0.7), 
                          fontSize: '0.875rem' 
                        }}>
                          {attributeData?.dataSteward}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Sample Values */}
                <Paper sx={{ 
                  p: 3, 
                  mb: 3,
                  borderRadius: '12px',
                  boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
                }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: alpha('#000', 0.8),
                    fontWeight: 500,
                    fontSize: '1rem',
                    mb: 2
                  }}>
                    Sample Values
                  </Typography>
                  <Box sx={{ 
                    backgroundColor: alpha('#f5f5f5', 0.5),
                    p: 1.5,
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: alpha('#000', 0.7),
                    lineHeight: 1.5
                  }}>
                    {renderValuePreview(attributeData?.sampleValues, attributeData?.dataType || '')}
                  </Box>
                </Paper>

                {/* AEP Datasets */}
                <Paper sx={{ 
                  p: 3, 
                  mb: 3,
                  borderRadius: '12px',
                  boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
                }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: alpha('#000', 0.8),
                    fontWeight: 500,
                    fontSize: '1rem',
                    mb: 2
                  }}>
                    AEP Datasets
                  </Typography>
                  <Box sx={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1
                  }}>
                    {attributeData?.aepDatasets?.map((dataset, index) => (
                      <Chip
                        key={index}
                        label={dataset}
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
                    ))}
                  </Box>
                </Paper>

                {/* Sample Snapshot Query */}
                <Paper sx={{ 
                  p: 3,
                  borderRadius: '12px',
                  boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
                }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: alpha('#000', 0.8),
                    fontWeight: 500,
                    fontSize: '1rem',
                    mb: 2
                  }}>
                    Sample Snapshot Query
                  </Typography>
                  <Box sx={{ 
                    backgroundColor: alpha('#f5f5f5', 0.5),
                    p: 1.5,
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: alpha('#000', 0.7),
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    overflow: 'auto'
                  }}>
                    {attributeData?.sampleSnapshotQuery}
                  </Box>
                </Paper>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                {renderContent()}
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                {renderLineageContent()}
              </TabPanel>
            </Box>
          </Box>
        </Box>
      </Box>

      <EditDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        onSave={handleEditSave}
        initialData={editFormData}
      />
    </Box>
  );
};

export default AttributeDetails; 