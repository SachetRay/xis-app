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
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
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
import { transformUserData } from '../../utils/userDataTransformer';

interface AttributeDetailsProps {
  attributePath?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Dataset {
  id: string;
  name: string;
  description?: string;
}

interface AttributeMetadata {
  name: string;
  path: string;
  value: any;
  description: string;
  owner: string;
  dataSteward: string;
  dataType: string;
  sampleValues: any[];
  aepDatasets?: Dataset[];
  sampleSnapshotQuery?: string;
  tags?: string[];
  latency?: string;
  displayName?: string;
  xdmSchema?: string;
  xdmFieldGroup?: string;
  xdmPath?: string;
  definition?: string;
  status?: string;
  usageCount?: number;
  lastModified?: string;
  dataClassification?: string;
  identity?: boolean;
  dataSource?: string;
  historicalDataEnabled?: boolean;
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
    description: initialData?.description || '',
    latency: initialData?.latency || '',
    tags: initialData?.tags || []
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

const AttributeDetails: React.FC<AttributeDetailsProps> = ({ attributePath: propAttributePath }) => {
  const [attributeDetails, setAttributeDetails] = useState<AttributeMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<AttributeMetadata>>({
    description: '',
    latency: '',
    tags: []
  });
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  // Get path from URL if not provided as prop
  const attributePath = propAttributePath || decodeURIComponent(location.pathname.split('/attribute/')[1]);

  const fetchAttributeDetails = () => {
    if (!attributePath) {
      console.error('No attribute path provided');
      setError('No attribute path provided');
      return;
    }

    setLoading(true);
    try {
      // Get the path from the URL and decode it
      const fullPath = decodeURIComponent(attributePath);
      console.log('Full decoded path:', fullPath);

      // Remove any leading/trailing slashes and split
      const pathSegments = fullPath.split('/').filter(Boolean);
      console.log('Path segments:', pathSegments);

      // Try to get data from transformed structure first
      const transformedData = transformUserData(userData);
      console.log('Transformed data:', transformedData);

      let currentData: any;
      let isTransformedPath = false;
      let originalPath = '';

      // First, try to find the path in transformed data
      try {
        currentData = transformedData;
        let tempData: Record<string, any> = transformedData as Record<string, any>;
        
        for (const segment of pathSegments) {
          // Try different variations of the segment name
          const variations = [
            segment,
            segment.toLowerCase(),
            // Convert space-separated to camelCase
            segment.split(' ')
              .map((word, index) => index === 0 
                ? word.toLowerCase() 
                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              ).join('')
          ];

          const matchingKey = Object.keys(tempData).find(key => 
            variations.includes(key) || variations.includes(key.toLowerCase())
          );

          if (!matchingKey || typeof tempData !== 'object') {
            throw new Error('Path not found in transformed data');
          }

          tempData = tempData[matchingKey];
        }
        
        isTransformedPath = true;
        currentData = tempData;
        console.log('Found path in transformed data');

        // Complete mapping of transformed paths to original paths
        const pathMappings: Record<string, string> = {
          // User Details - Identity
          'userDetails/identity/firstName': 'person/name/firstname',
          'userDetails/identity/lastName': 'person/name/lastname',
          'userDetails/identity/countryCode': 'homeAddress/countryCode',
          'userDetails/identity/userAccountCreationDate': 'adobeCorpnew/memberAccountGUID/userDetails/userAccountCreationDate',
          'userDetails/identity/isAdobeEmployee': 'adobeCorpnew/isAdobeEmployee',
          
          // User Details - Email
          'userDetails/email/address': 'personalEmail/address',
          'userDetails/email/emailDomain': 'adobeCorpnew/emailDomain',
          'userDetails/email/hashedEmail': 'adobeCorpnew/hashedEmail',
          'userDetails/email/emailValidFlag': 'adobeCorpnew/emailValidFlag',
          
          // User Details - Authentication
          'userDetails/authentication/authenticationSource': 'adobeCorpnew/memberAccountGUID/userDetails/authenticationSource',
          'userDetails/authentication/authenticationSourceType': 'adobeCorpnew/memberAccountGUID/userDetails/authenticationSourceType',
          'userDetails/authentication/signupSourceName': 'adobeCorpnew/memberAccountGUID/userDetails/signupSourceName',
          'userDetails/authentication/signupSocialAccount': 'adobeCorpnew/memberAccountGUID/userDetails/signupSocialAccount',
          'userDetails/authentication/signupCategory': 'adobeCorpnew/memberAccountGUID/userDetails/signupCategory',
          
          // User Details - Account System Info
          'userDetails/accountSystemInfo/type2eLinkedStatus': 'adobeCorpnew/memberAccountGUID/userDetails/type2eLinkedStatus',
          'userDetails/accountSystemInfo/linkToType2e': 'adobeCorpnew/memberAccountGUID/userDetails/linkToType2e',
          'userDetails/accountSystemInfo/type2eParentType': 'adobeCorpnew/memberAccountGUID/userDetails/type2eParentType',
          
          // User Details - Language Preferences
          'userDetails/languagePreferences/firstPref': 'adobeCorpnew/memberAccountGUID/userDetails/firstPref',
          'userDetails/languagePreferences/secondPref': 'adobeCorpnew/memberAccountGUID/userDetails/secondPref',
          'userDetails/languagePreferences/thirdPref': 'adobeCorpnew/memberAccountGUID/userDetails/thirdPref',
          
          // User Details - Status
          'userDetails/status/ccFunnelState': 'adobeCorpnew/memberAccountGUID/userDetails/ccFunnelState',
          'userDetails/status/dcFunnelState': 'adobeCorpnew/memberAccountGUID/userDetails/dcFunnelState',
          'userDetails/status/customerState': 'adobeCorpnew/memberAccountGUID/userDetails/applicationDetails/PHOTOSHOP/customerState',
          'userDetails/status/applicationDetails/customerState': 'adobeCorpnew/memberAccountGUID/userDetails/applicationDetails/PHOTOSHOP/customerState',
          
          // Email Marketing Permission
          'emailMarketingPermission': 'personalEmail/optInOut',
          'Email Marketing Permission': 'personalEmail/optInOut',
          'emailMarketingPermission/val': 'personalEmail/optInOut/val',
          'emailMarketingPermission/time': 'personalEmail/optInOut/time',
          
          // Individual Entitlements
          'individualEntitlements': 'adobeCorpnew/entitlements',
          'Individual Entitlements': 'adobeCorpnew/entitlements',
          'individualEntitlements/numberOfEntitledProducts': 'adobeCorpnew/entitlements/numberOfEntitledProducts',
          'individualEntitlements/productInfo': 'adobeCorpnew/entitlements/productInfo',
          'individualEntitlements/productInfo/productCode': 'adobeCorpnew/entitlements/productInfo/productCode',
          'individualEntitlements/productInfo/productName': 'adobeCorpnew/entitlements/productInfo/productName',
          'individualEntitlements/productInfo/productID': 'adobeCorpnew/entitlements/productInfo/productID',
          'individualEntitlements/productInfo/family': 'adobeCorpnew/entitlements/productInfo/family',
          'individualEntitlements/productInfo/bundleID': 'adobeCorpnew/entitlements/productInfo/bundleID',
          'individualEntitlements/offerInfo': 'adobeCorpnew/entitlements/offerInfo',
          'individualEntitlements/acquisitionInfo': 'adobeCorpnew/entitlements/acquisitionInfo',
          'individualEntitlements/trialInfo': 'adobeCorpnew/entitlements/trialInfo',
          'individualEntitlements/statusInfo': 'adobeCorpnew/entitlements/statusInfo',
          
          // Team Entitlements
          'teamEntitlements': 'adobeCorpnew/memberAccountGUID/contract',
          'Team Entitlements': 'adobeCorpnew/memberAccountGUID/contract',
          'teamEntitlements/contractInfo': 'adobeCorpnew/memberAccountGUID/contract',
          'teamEntitlements/contractInfo/buyingProgram': 'adobeCorpnew/memberAccountGUID/contract/buyingProgram',
          'teamEntitlements/contractInfo/contractStartDTS': 'adobeCorpnew/memberAccountGUID/contract/contractStartDTS',
          'teamEntitlements/contractInfo/contractEndDTS': 'adobeCorpnew/memberAccountGUID/contract/contractEndDTS',
          'teamEntitlements/contractInfo/contractStatus': 'adobeCorpnew/memberAccountGUID/contract/contractStatus',
          'teamEntitlements/contractInfo/contractType': 'adobeCorpnew/memberAccountGUID/contract/contractType',
          'teamEntitlements/adminRoles': 'adobeCorpnew/memberAccountGUID/contract/adminRoles',
          'teamEntitlements/b2bEntitlements': 'adobeCorpnew/memberAccountGUID/contract/b2bEntitlements',
          
          // Models and Scores
          'modelsAndScores': 'adobeCorpnew/memberAccountGUID/modelsAndScores',
          'Models and Scores': 'adobeCorpnew/memberAccountGUID/modelsAndScores',
          'modelsAndScores/overallScore': 'adobeCorpnew/memberAccountGUID/modelsAndScores/SKU_RANK',
          'modelsAndScores/overallScore/modelScore': 'adobeCorpnew/memberAccountGUID/modelsAndScores/SKU_RANK/modelScore',
          'modelsAndScores/overallScore/modelPercentileScore': 'adobeCorpnew/memberAccountGUID/modelsAndScores/SKU_RANK/modelPercentileScore',
          'modelsAndScores/overallScore/modelScoreDate': 'adobeCorpnew/memberAccountGUID/modelsAndScores/SKU_RANK/modelScoreDate',
          'modelsAndScores/overallScore/modelUserSegment': 'adobeCorpnew/memberAccountGUID/modelsAndScores/SKU_RANK/modelUserSegment',
          'modelsAndScores/actions': 'adobeCorpnew/memberAccountGUID/modelsAndScores/actions',
          'modelsAndScores/contents': 'adobeCorpnew/memberAccountGUID/modelsAndScores/contents',
          
          // Product Activity
          'productActivity': 'adobeCorpnew/memberAccountGUID/productActivity',
          'Product Activity': 'adobeCorpnew/memberAccountGUID/productActivity',
          'productActivity/installs': 'adobeCorpnew/memberAccountGUID/productActivity/installs',
          'productActivity/launches': 'adobeCorpnew/memberAccountGUID/productActivity/launches',
          'productActivity/installs/desktop': 'adobeCorpnew/memberAccountGUID/productActivity/installs/desktop',
          'productActivity/installs/mobile': 'adobeCorpnew/memberAccountGUID/productActivity/installs/mobile',
          'productActivity/installs/web': 'adobeCorpnew/memberAccountGUID/productActivity/installs/web',
          'productActivity/launches/desktop': 'adobeCorpnew/memberAccountGUID/productActivity/launches/desktop',
          'productActivity/launches/mobile': 'adobeCorpnew/memberAccountGUID/productActivity/launches/mobile'
        };

        // Function to find the most specific path mapping
        const findOriginalPath = (transformedPath: string): string => {
          // Try exact match first
          if (pathMappings[transformedPath]) {
            return pathMappings[transformedPath];
          }

          // Find all parent paths that match
          const matchingPaths = Object.entries(pathMappings)
            .filter(([key]) => transformedPath.startsWith(key))
            .sort((a, b) => b[0].length - a[0].length); // Sort by length descending

          if (matchingPaths.length > 0) {
            // Use the longest matching path
            const [matchingPath, originalPathPrefix] = matchingPaths[0];
            // Get the remaining path segments
            const remainingPath = transformedPath.slice(matchingPath.length);
            // If there's a remaining path, append it to the original path
            return remainingPath ? 
              `${originalPathPrefix}${remainingPath}` : 
              originalPathPrefix;
          }

          // If no mapping found, return the path as is
          return transformedPath;
        };

        // Get the original path
        originalPath = findOriginalPath(pathSegments.join('/'));

      } catch (e) {
        // If not found in transformed data, try original data structure
        console.log('Path not found in transformed data, trying original structure');
        
        const validRootPaths = ['person', 'homeAddress', 'personalEmail', 'adobeCorpnew'];
        if (!validRootPaths.includes(pathSegments[0])) {
          throw new Error(`Invalid root path: ${pathSegments[0]}. Available root paths are: ${validRootPaths.join(', ')}`);
        }
        
        currentData = userData;
        originalPath = pathSegments.join('/');
        
        // Navigate through original data structure
        for (const segment of pathSegments) {
          if (!currentData || typeof currentData !== 'object' || !(segment in currentData)) {
            throw new Error(`Invalid path: ${pathSegments.join('/')} (${segment} is not valid)`);
          }
          currentData = currentData[segment];
        }
      }

      // Set the attribute details
      setAttributeDetails({
        name: pathSegments[pathSegments.length - 1],
        path: pathSegments.join('/'),
        value: currentData,
        dataType: typeof currentData,
        xdmPath: `xdm:${originalPath}`, // Always use original path for XDM
        description: getAttributeDescription(pathSegments[pathSegments.length - 1]),
        status: 'Active',
        owner: 'Data Team',
        lastModified: new Date().toISOString(),
        usageCount: Math.floor(Math.random() * 1000),
        tags: ['user', 'profile', 'attribute'],
        dataClassification: 'Confidential',
        displayName: pathSegments[pathSegments.length - 1],
        definition: getAttributeDescription(pathSegments[pathSegments.length - 1]),
        sampleValues: generateAllPossibleValues(typeof currentData),
        xdmSchema: 'https://ns.adobe.com/xdm/context/profile',
        xdmFieldGroup: 'profile-personal-details',
        latency: 'Real-time',
        identity: false,
        historicalDataEnabled: true,
        dataSteward: 'John Doe',
        dataSource: isTransformedPath ? 'Transformed Data Service' : 'User Profile Service',
        aepDatasets: [
          { id: '1', name: 'Profile Dataset', description: 'Main profile dataset' },
          { id: '2', name: 'Identity Dataset', description: 'Identity management dataset' }
        ],
        sampleSnapshotQuery: `SELECT * FROM ${isTransformedPath ? 'transformed_profile' : 'profile'} WHERE ${originalPath} IS NOT NULL LIMIT 5`
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching attribute details:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching attribute details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributeDetails();
  }, [attributePath]);

  const getAttributeDescription = (attributeName: string): string => {
    const descriptions: Record<string, string> = {
      'id': 'A unique identifier for the entity.',
      'name': 'The display name or title of the entity.',
      'createdAt': 'The timestamp when this entity was created.',
      'updatedAt': 'The timestamp when this entity was last updated.',
      'status': 'The current status of the entity.',
      'type': 'The type or category of the entity.',
      'description': 'A detailed description of the entity.',
      'email': 'Email address associated with the entity.',
      'phone': 'Phone number associated with the entity.',
      'address': 'Physical or mailing address.',
      'tags': 'Labels or categories associated with the entity.',
      'metadata': 'Additional metadata or properties.',
      'config': 'Configuration settings or parameters.',
      'permissions': 'Access control and permission settings.',
      'version': 'Version number or identifier.',
    };

    return descriptions[attributeName.toLowerCase()] || 'No description available';
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const renderValuePreview = (value: any): string => {
    if (!value) return 'No sample values available';
    if (Array.isArray(value)) {
      return value.slice(0, 3).map(String).join(', ') + (value.length > 3 ? '...' : '');
    }
    return String(value);
  };

  const handleExpandSection = (section: string) => {
    // Implementation of handleExpandSection
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    // Implementation of handleMenuClick
  };

  const handleDrawerToggle = () => {
    // Implementation of handleDrawerToggle
  };

  const handleSpeedDialToggle = () => {
    // Implementation of handleSpeedDialToggle
  };

  const handleEditClick = () => {
    setEditFormData({
      description: attributeDetails?.description || '',
      latency: attributeDetails?.latency || '',
      tags: attributeDetails?.tags || []
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditSave = (data: Partial<AttributeMetadata>) => {
    if (attributeDetails) {
      setAttributeDetails({ ...attributeDetails, ...data });
    }
    setEditDialogOpen(false);
  };

  const handleTagDelete = (tag: string) => {
    if (attributeDetails?.tags) {
      const updatedTags = attributeDetails.tags.filter(t => t !== tag);
      setAttributeDetails(prev => prev ? { ...prev, tags: updatedTags } : null);
    }
  };

  const handleDatasetChange = (dataset: Dataset, index: number) => {
    if (attributeDetails?.aepDatasets) {
      const updatedDatasets = [...attributeDetails.aepDatasets];
      updatedDatasets[index] = dataset;
      setAttributeDetails(prev => prev ? { ...prev, aepDatasets: updatedDatasets } : null);
    }
  };

  const handleDatasetDelete = (index: number) => {
    setAttributeDetails(prev => {
      if (!prev?.aepDatasets) return prev;
      const newDatasets = [...prev.aepDatasets];
      newDatasets.splice(index, 1);
      return { ...prev, aepDatasets: newDatasets };
    });
  };

  const generateAllPossibleValues = (dataType: string): any[] => {
    switch (dataType.toLowerCase()) {
      case 'boolean':
        return [true, false];
      case 'string':
        return ['Sample text value'];
      case 'number':
        return [0, 1, 100, -1];
      case 'object':
        return [{ key: 'value' }];
      case 'status':
        return ['active', 'inactive', 'pending', 'archived'];
      case 'priority':
        return ['low', 'medium', 'high', 'critical'];
      case 'visibility':
        return ['public', 'private', 'restricted'];
      default:
        return ['Values depend on the specific use case and business rules'];
    }
  };

  const handleIdentityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAttributeDetails(prev => prev ? { ...prev, identity: event.target.checked } : null);
  };

  const handleDataTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDataType = event.target.value;
    setAttributeDetails(prev => prev ? {
      ...prev,
      dataType: newDataType,
      sampleValues: generateAllPossibleValues(newDataType)
    } : null);
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
            {(attributeDetails?.usageCount ? Math.floor(attributeDetails.usageCount / 10) : 0).toLocaleString()}
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
            {(attributeDetails?.usageCount ? Math.floor(attributeDetails.usageCount / 25) : 0).toLocaleString()}
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
    </Box>
  );

  // Add a new function to render the lineage content
  const renderLineageContent = () => (
    <Box sx={{ px: 2, pt: 0.2, pb: 2 }}>
      <Paper sx={{ 
        p: 2,
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
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: alpha(theme.palette.background.default, 0.5),
      overflow: 'hidden'
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
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        p: '8px',
        gap: 2,
        overflow: 'hidden'
      }}>
        <Box sx={{ display: 'flex', gap: 2, flex: 1, overflow: 'hidden' }}>
          {/* Left Panel - Overview */}
          <Paper sx={{ 
            width: 300,
            p: 2, 
            borderRight: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.08),
            borderRadius: '12px',
            boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
            overflow: 'auto',
            height: '100%'
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
                {attributeDetails?.displayName || attributeDetails?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ 
                color: alpha('#000', 0.6),
                fontSize: '0.875rem',
                lineHeight: 1.6
              }}>
                {attributeDetails?.definition || attributeDetails?.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {attributeDetails?.tags?.map((tag, index) => (
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
                  {attributeDetails?.dataType}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Chip
                  label={attributeDetails?.status}
                  size="small"
                  sx={{
                    backgroundColor: attributeDetails?.status === 'Active' 
                      ? alpha(theme.palette.success.main, 0.1)
                      : alpha(theme.palette.warning.main, 0.1),
                    color: attributeDetails?.status === 'Active'
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
                  {attributeDetails?.owner}
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
                  {attributeDetails?.dataSteward}
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
                {attributeDetails?.lastModified}
              </Typography>
            </Box>
          </Paper>

          {/* Right Panel - Content Tabs */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
          }}>
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: alpha(theme.palette.divider, 0.08),
              px: 2,
              mb: 2,
              flexShrink: 0
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
              flex: 1,
              overflow: 'auto',
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
                          {attributeDetails?.dataType}
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
                          {attributeDetails?.dataClassification}
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
                          Identity
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: alpha('#000', 0.7), 
                          fontSize: '0.875rem' 
                        }}>
                          {attributeDetails?.identity}
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
                          {attributeDetails?.latency}
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
                          {attributeDetails?.dataSource}
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
                            label={attributeDetails?.historicalDataEnabled ? "Yes" : "No"}
                            size="small"
                            sx={{
                              backgroundColor: attributeDetails?.historicalDataEnabled 
                                ? alpha(theme.palette.success.main, 0.1)
                                : alpha(theme.palette.warning.main, 0.1),
                              color: attributeDetails?.historicalDataEnabled
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
                          {attributeDetails?.xdmSchema}
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
                          {attributeDetails?.xdmFieldGroup}
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
                          {attributeDetails?.xdmPath}
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
                          {attributeDetails?.owner}
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
                          {attributeDetails?.dataSteward}
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
                    {renderValuePreview(attributeDetails?.sampleValues)}
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
                    {attributeDetails?.aepDatasets?.map((dataset: Dataset, index: number) => (
                      <Chip
                        key={dataset.id}
                        label={dataset.name}
                        onDelete={() => handleDatasetDelete(index)}
                        sx={{ margin: 0.5 }}
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
                    {attributeDetails?.sampleSnapshotQuery}
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