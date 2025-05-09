import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Divider,
  Alert,
  Snackbar,
  alpha,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  SelectChangeEvent,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Search as SearchIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { userData } from '../../data/userData';
import { transformedUserData } from '../../data/transformedUserData';
import { 
  updateTransformedData, 
  getAllMappings, 
  addMapping, 
  deleteMapping,
  PathMapping as IPathMapping 
} from '../../utils/userDataTransformer';

// Interface for XDM path mapping with UI-specific fields
interface PathMapping extends Omit<IPathMapping, 'transform'> {
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  level5: string;
}

// Function to extract all leaf node paths from userData
const extractXDMPaths = (obj: any, parentPath: string = ''): string[] => {
  let paths: string[] = [];
  
  for (const key in obj) {
    const currentPath = parentPath ? `${parentPath}/${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Only recurse if it's an object and not null
      paths = [...paths, ...extractXDMPaths(obj[key], currentPath)];
    } else {
      // Only add leaf nodes (non-object values)
      paths.push(currentPath);
    }
  }
  
  return paths;
};

// Function to extract transformed paths from transformedUserData
const extractTransformedPaths = (obj: any, parentPath: string = ''): string[] => {
  let paths: string[] = [];
  
  for (const key in obj) {
    const currentPath = parentPath ? `${parentPath}/${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Only recurse if it's an object and not null
      paths = [...paths, ...extractTransformedPaths(obj[key], currentPath)];
    } else {
      // Only add leaf nodes (non-object values)
      paths.push(currentPath);
    }
  }
  
  return paths;
};

// Function to get value at path from an object
const getValueAtPath = (obj: any, path: string): any => {
  return path.split('/').reduce((acc, part) => acc && acc[part], obj);
};

// Function to find matching transformed path for an XDM path
const findMatchingTransformedPath = (xdmPath: string, xdmValue: any, transformedPaths: string[]): string => {
  // Try to find a path with matching value
  for (const transformedPath of transformedPaths) {
    const transformedValue = getValueAtPath(transformedUserData, transformedPath);
    if (transformedValue === xdmValue) {
      return transformedPath;
    }
  }
  return ''; // Return empty string if no match found
};

// Convert a flat transformed path to levels
const splitPathIntoLevels = (path: string): { level1: string; level2: string; level3: string; level4: string; level5: string } => {
  const parts = path.split('/');
  return {
    level1: parts[0] || '',
    level2: parts[1] || '',
    level3: parts[2] || '',
    level4: parts[3] || '',
    level5: parts[4] || ''
  };
};

// Convert levels back to a flat path
const combineLevelsToPath = (levels: { level1: string; level2: string; level3: string; level4: string; level5: string }): string => {
  return [levels.level1, levels.level2, levels.level3, levels.level4, levels.level5]
    .filter(Boolean)
    .join('/');
};

const XDMPathMapping: React.FC = () => {
  const theme = useTheme();
  
  // Extract leaf node paths from userData and transformedUserData
  const xdmPaths = useMemo(() => extractXDMPaths(userData), []);
  const transformedPaths = useMemo(() => extractTransformedPaths(transformedUserData), []);
  
  // Create initial mappings by combining stored mappings and extracting from data structure
  const initialMappings = useMemo(() => {
    // Get stored mappings from userDataTransformer
    const existingMappings = getAllMappings();
    const mappingsMap = new Map<string, PathMapping>();
    
    // Add existing mappings first
    existingMappings.forEach(mapping => {
      const levels = splitPathIntoLevels(mapping.transformedPath);
      mappingsMap.set(mapping.xdmPath, {
        id: mapping.id,
        xdmPath: mapping.xdmPath,
        transformedPath: mapping.transformedPath,
        ...levels
      });
    });
    
    // Add any XDM paths that don't have a mapping yet
    xdmPaths.forEach((xdmPath, index) => {
      if (!mappingsMap.has(xdmPath)) {
        const xdmValue = getValueAtPath(userData, xdmPath);
        const transformedPath = findMatchingTransformedPath(xdmPath, xdmValue, transformedPaths);
        
        // Define default levels based on path structure or use empty strings
        let levels = splitPathIntoLevels(transformedPath);
        
        // If no match was found, create a suggestive mapping based on the path structure
        if (!transformedPath) {
          // Map user details paths
          if (xdmPath.includes('person/name') || xdmPath.includes('homeAddress') || xdmPath.includes('isAdobeEmployee')) {
            levels = {
              level1: 'User Details',
              level2: 'Identity',
              level3: xdmPath.split('/').pop() || '',
              level4: '',
              level5: ''
            };
          } else if (xdmPath.includes('personalEmail') || xdmPath.includes('emailDomain') || xdmPath.includes('emailValidFlag') || xdmPath.includes('hashedEmail')) {
            levels = {
              level1: 'User Details',
              level2: 'Email',
              level3: xdmPath.split('/').pop() || '',
              level4: '',
              level5: ''
            };
          } else if (xdmPath.includes('authenticationSource') || xdmPath.includes('signupSource')) {
            levels = {
              level1: 'User Details',
              level2: 'Authentication',
              level3: xdmPath.split('/').pop() || '',
              level4: '',
              level5: ''
            };
          } else if (xdmPath.includes('type2e')) {
            levels = {
              level1: 'User Details',
              level2: 'Account System Info',
              level3: xdmPath.split('/').pop() || '',
              level4: '',
              level5: ''
            };
          } else if (xdmPath.includes('Pref')) {
            levels = {
              level1: 'User Details',
              level2: 'Language Preferences',
              level3: xdmPath.split('/').pop() || '',
              level4: '',
              level5: ''
            };
          } else if (xdmPath.includes('FunnelState') || xdmPath.includes('customerState')) {
            levels = {
              level1: 'User Details',
              level2: 'Status',
              level3: xdmPath.split('/').pop() || '',
              level4: '',
              level5: ''
            };
          }
          // Map entitlements paths
          else if (xdmPath.includes('entitlements/phsp_direct_individual')) {
            const parts = xdmPath.split('/');
            const lastPart = parts[parts.length - 1];
            levels = {
              level1: 'Individual Entitlements',
              level2: 'Product Info',
              level3: lastPart,
              level4: '',
              level5: ''
            };
          } else if (xdmPath.includes('contract')) {
            const parts = xdmPath.split('/');
            const lastPart = parts[parts.length - 1];
            levels = {
              level1: 'Team Entitlements',
              level2: 'Contract Info',
              level3: lastPart,
              level4: '',
              level5: ''
            };
          }
          // Map models and scores paths
          else if (xdmPath.includes('modelsAndScores')) {
            const parts = xdmPath.split('/');
            const lastPart = parts[parts.length - 1];
            if (xdmPath.includes('actions')) {
              levels = {
                level1: 'Models and Scores',
                level2: 'Actions',
                level3: lastPart,
                level4: '',
                level5: ''
              };
            } else {
              levels = {
                level1: 'Models and Scores',
                level2: 'Overall Score',
                level3: lastPart,
                level4: '',
                level5: ''
              };
            }
          }
          // Map product activity paths
          else if (xdmPath.includes('appUsage')) {
            const parts = xdmPath.split('/');
            const platform = parts.includes('desktop') ? 'Desktop' : parts.includes('web') ? 'Web' : 'Mobile';
            const os = parts.includes('mac') ? 'Mac' : parts.includes('windows') ? 'Windows' : parts.includes('iOS') ? 'iOS' : 'Android';
            levels = {
              level1: 'Product Activity',
              level2: parts.includes('appInstalls') ? 'Installs' : 'Launches',
              level3: platform,
              level4: os,
              level5: parts[parts.length - 1]
            };
          }
        }

        // Create the transformed path from levels
        const updatedTransformedPath = combineLevelsToPath(levels);

        mappingsMap.set(xdmPath, {
          id: `${Date.now()}-${index}`,
          xdmPath,
          transformedPath: updatedTransformedPath,
          ...levels
        });
      }
    });
    
    return Array.from(mappingsMap.values());
  }, [xdmPaths, transformedPaths]);

  const [mappings, setMappings] = useState<PathMapping[]>(initialMappings);
  const [filteredMappings, setFilteredMappings] = useState<PathMapping[]>(initialMappings);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMapping, setEditingMapping] = useState<PathMapping | null>(null);
  const [newMapping, setNewMapping] = useState<PathMapping>({
    id: '',
    xdmPath: '',
    transformedPath: '',
    level1: '',
    level2: '',
    level3: '',
    level4: '',
    level5: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // State for storing available level options
  const [levelOptions, setLevelOptions] = useState({
    level1: new Set<string>(),
    level2: new Set<string>(),
    level3: new Set<string>(),
    level4: new Set<string>(),
    level5: new Set<string>()
  });

  // State for adding new options
  const [addingNewOption, setAddingNewOption] = useState({
    level: '',
    value: ''
  });

  // State for managing dropdown dialog
  const [openOptionsDialog, setOpenOptionsDialog] = useState(false);

  // Extract unique options for each level from mappings
  useEffect(() => {
    const newOptions = {
      level1: new Set([
        'User Details',
        'Individual Entitlements',
        'Team Entitlements',
        'Models and Scores',
        'Product Activity'
      ]),
      level2: new Set([
        'Identity',
        'Email',
        'Authentication',
        'Account System Info',
        'Language Preferences',
        'Status',
        'Product Info',
        'Contract Info',
        'Overall Score',
        'Actions',
        'Installs',
        'Launches'
      ]),
      level3: new Set([
        'Desktop',
        'Web',
        'Mobile',
        'firstName',
        'lastName',
        'countryCode',
        'address',
        'emailDomain',
        'hashedEmail',
        'emailValidFlag',
        'authenticationSource',
        'signupSourceName',
        'signupSocialAccount',
        'type2eLinkedStatus',
        'linkToType2e',
        'type2eParentType',
        'firstPref',
        'secondPref',
        'thirdPref',
        'ccFunnelState',
        'dcFunnelState',
        'customerState'
      ]),
      level4: new Set([
        'Mac',
        'Windows',
        'iOS',
        'Android'
      ]),
      level5: new Set([
        'firstActivityDate',
        'recentActivityDate',
        'mostRecentAppVersion',
        'mostRecentOSVersion'
      ])
    };

    // Add all existing values from mappings
    mappings.forEach(mapping => {
      if (mapping.level1) newOptions.level1.add(mapping.level1);
      if (mapping.level2) newOptions.level2.add(mapping.level2);
      if (mapping.level3) newOptions.level3.add(mapping.level3);
      if (mapping.level4) newOptions.level4.add(mapping.level4);
      if (mapping.level5) newOptions.level5.add(mapping.level5);
    });

    setLevelOptions(newOptions);
  }, [mappings]);

  // Filter mappings based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMappings(mappings);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = mappings.filter(mapping => 
      mapping.xdmPath.toLowerCase().includes(query) || 
      mapping.level1.toLowerCase().includes(query) ||
      mapping.level2.toLowerCase().includes(query) ||
      mapping.level3.toLowerCase().includes(query) ||
      mapping.level4.toLowerCase().includes(query) ||
      mapping.level5.toLowerCase().includes(query) ||
      getFullPath(mapping).toLowerCase().includes(query)
    );
    
    setFilteredMappings(filtered);
  }, [searchQuery, mappings]);

  // Reset the new mapping form when dialog closes
  useEffect(() => {
    if (!openDialog) {
      setNewMapping({
        id: '',
        xdmPath: '',
        transformedPath: '',
        level1: '',
        level2: '',
        level3: '',
        level4: '',
        level5: ''
      });
    }
  }, [openDialog]);

  // Listen for mapping updates from other components
  useEffect(() => {
    const handleMappingUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ 
        xdmPath: string; 
        transformedPath: string; 
      }>;
      
      const { xdmPath, transformedPath } = customEvent.detail;
      
      // Update our local mappings
      setMappings(prevMappings => {
        const updatedMappings = [...prevMappings];
        const existingIndex = updatedMappings.findIndex(m => m.xdmPath === xdmPath);
        
        if (existingIndex >= 0) {
          const levels = splitPathIntoLevels(transformedPath);
          updatedMappings[existingIndex] = {
            ...updatedMappings[existingIndex],
            transformedPath,
            ...levels
          };
        }
        
        return updatedMappings;
      });
    };
    
    window.addEventListener('mappingUpdated', handleMappingUpdate);
    
    return () => {
      window.removeEventListener('mappingUpdated', handleMappingUpdate);
    };
  }, []);

  const handleOpenDialog = (mapping?: PathMapping) => {
    if (mapping) {
      setEditingMapping(mapping);
      setNewMapping({ ...mapping });
    } else {
      setEditingMapping(null);
      setNewMapping({
        id: Date.now().toString(),
        xdmPath: '',
        transformedPath: '',
        level1: '',
        level2: '',
        level3: '',
        level4: '',
        level5: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMapping(null);
  };

  const handleOpenOptionsDialog = (level: string) => {
    setAddingNewOption({
      level,
      value: ''
    });
    setOpenOptionsDialog(true);
  };

  const handleCloseOptionsDialog = () => {
    setOpenOptionsDialog(false);
    setAddingNewOption({
      level: '',
      value: ''
    });
  };

  const handleAddNewOption = () => {
    if (!addingNewOption.value.trim()) {
      setSnackbar({
        open: true,
        message: 'Option value cannot be empty',
        severity: 'error'
      });
      return;
    }

    const level = addingNewOption.level as keyof typeof levelOptions;
    setLevelOptions(prev => {
      const newSet = new Set(prev[level]);
      newSet.add(addingNewOption.value);
      return {
        ...prev,
        [level]: newSet
      };
    });

    // Set the new option as the selected value in the current mapping
    setNewMapping(prev => ({
      ...prev,
      [level]: addingNewOption.value
    }));

    handleCloseOptionsDialog();
    
    setSnackbar({
      open: true,
      message: `New option added to ${level.replace('level', 'Level ')}`,
      severity: 'success'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMapping(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOptionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddingNewOption(prev => ({
      ...prev,
      value: e.target.value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewMapping(prev => {
      const updated = { ...prev, [name]: value };
      // Update transformedPath when level fields change
      updated.transformedPath = combineLevelsToPath(updated);
      return updated;
    });
  };

  // Modified handleSaveMapping to update transformedUserData and mappings store
  const handleSaveMapping = () => {
    if (!newMapping.level1) {
      setSnackbar({
        open: true,
        message: 'Level 1 is required',
        severity: 'error'
      });
      return;
    }

    // Ensure transformedPath is up to date with the levels
    const transformedPath = combineLevelsToPath(newMapping);
    
    if (editingMapping) {
      // Update the mapping in the transformer
      addMapping({
        id: newMapping.id,
        xdmPath: newMapping.xdmPath,
        transformedPath
      });

      // Update our local state
      setMappings(prevMappings => 
        prevMappings.map(m => {
          if (m.id === editingMapping.id) {
            return { ...newMapping, transformedPath };
          }
          return m;
        })
      );

      // Update the transformed data
      const updatedData = updateTransformedData(
        newMapping.xdmPath,
        transformedPath,
        transformedUserData
      );

      // Dispatch a custom event to notify DataWizard
      const event = new CustomEvent('transformedDataUpdated', {
        detail: { updatedData }
      });
      window.dispatchEvent(event);

      setSnackbar({
        open: true,
        message: 'Mapping updated successfully',
        severity: 'success'
      });
    } else {
      // Add new mapping 
      addMapping({
        id: newMapping.id,
        xdmPath: newMapping.xdmPath,
        transformedPath
      });

      // Update our local state
      setMappings(prevMappings => [...prevMappings, { ...newMapping, transformedPath }]);

      // Update the transformed data
      const updatedData = updateTransformedData(
        newMapping.xdmPath,
        transformedPath,
        transformedUserData
      );

      // Notify other components
      const event = new CustomEvent('transformedDataUpdated', {
        detail: { updatedData }
      });
      window.dispatchEvent(event);

      setSnackbar({
        open: true,
        message: 'New mapping added successfully',
        severity: 'success'
      });
    }
    
    handleCloseDialog();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Generate the full path from the levels
  const getFullPath = (mapping: PathMapping) => {
    return combineLevelsToPath(mapping);
  };

  // Render Select component for level fields
  const renderLevelSelect = (level: string, value: string, options: Set<string>) => {
    return (
      <FormControl fullWidth size="small">
        <InputLabel id={`${level}-label`}>{level.replace('level', 'Level ')}</InputLabel>
        <Select
          labelId={`${level}-label`}
          id={level}
          name={level}
          value={value}
          onChange={handleSelectChange}
          label={level.replace('level', 'Level ')}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300
              }
            }
          }}
          IconComponent={KeyboardArrowDownIcon}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenOptionsDialog(level);
                }}
                sx={{ mr: 1 }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          }
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {Array.from(options).sort().map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
          <MenuItem 
            sx={{ 
              color: theme.palette.primary.main,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              mt: 1,
              pt: 1
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenOptionsDialog(level);
            }}
          >
            <AddIcon fontSize="small" sx={{ mr: 1 }} />
            Add new option
          </MenuItem>
        </Select>
      </FormControl>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          XDM Path Mapping
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This page shows the mapping between XDM paths from the original user data and their transformed representation.
        The XDM paths are read-only and derived from the source data structure.
        You can edit the transformed path levels to update how the data is displayed in the Data Wizard.
      </Alert>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by XDM path or transformed path"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchQuery('')}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: '8px'
            }
          }}
        />
      </Box>

      <Paper sx={{ 
        borderRadius: '12px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', minWidth: 1200 }}>
          <Table stickyHeader sx={{ tableLayout: 'auto', minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  width: '25%',
                  padding: '16px',
                  backgroundColor: '#e3f2fd',
                  zIndex: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    XDM Path
                    <Tooltip title="The original path from the XDM user data structure">
                      <HelpIcon sx={{ ml: 1, fontSize: '0.875rem', color: alpha('#000', 0.5) }} />
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  padding: '16px',
                  backgroundColor: '#e3f2fd',
                  zIndex: 2
                }}>Level 1</TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  padding: '16px',
                  backgroundColor: '#e3f2fd',
                  zIndex: 2
                }}>Level 2</TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  padding: '16px',
                  backgroundColor: '#e3f2fd',
                  zIndex: 2
                }}>Level 3</TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  padding: '16px',
                  backgroundColor: '#e3f2fd',
                  zIndex: 2
                }}>Level 4</TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  padding: '16px',
                  backgroundColor: '#e3f2fd',
                  zIndex: 2
                }}>Level 5</TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  width: '20%',
                  padding: '16px',
                  backgroundColor: '#e3f2fd',
                  zIndex: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Transformed Path
                    <Tooltip title="The transformed path used in the data wizard">
                      <HelpIcon sx={{ ml: 1, fontSize: '0.875rem', color: alpha('#000', 0.5) }} />
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  padding: '16px',
                  backgroundColor: '#e3f2fd',
                  zIndex: 2,
                  width: '80px'
                }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMappings.map((mapping) => (
                <TableRow key={mapping.id} hover>
                  <TableCell sx={{ 
                    wordBreak: 'break-word', 
                    whiteSpace: 'normal',
                    padding: '12px 16px',
                    fontSize: '0.875rem'
                  }}>
                    {mapping.xdmPath}
                  </TableCell>
                  <TableCell sx={{ padding: '12px 16px', fontSize: '0.875rem' }}>{mapping.level1}</TableCell>
                  <TableCell sx={{ padding: '12px 16px', fontSize: '0.875rem' }}>{mapping.level2}</TableCell>
                  <TableCell sx={{ padding: '12px 16px', fontSize: '0.875rem' }}>{mapping.level3}</TableCell>
                  <TableCell sx={{ padding: '12px 16px', fontSize: '0.875rem' }}>{mapping.level4}</TableCell>
                  <TableCell sx={{ padding: '12px 16px', fontSize: '0.875rem' }}>{mapping.level5}</TableCell>
                  <TableCell sx={{ 
                    wordBreak: 'break-word', 
                    whiteSpace: 'normal',
                    padding: '12px 16px',
                    fontSize: '0.875rem'
                  }}>
                    {getFullPath(mapping)}
                  </TableCell>
                  <TableCell sx={{ padding: '12px 16px' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog(mapping)}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog for adding/editing mapping */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editingMapping ? 'Edit XDM Path Mapping' : 'Add New XDM Path Mapping'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="xdmPath"
                label="XDM Path"
                fullWidth
                value={newMapping.xdmPath}
                onChange={handleInputChange}
                helperText="The original XDM path from the data structure"
                required
                multiline
                maxRows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="caption" sx={{ color: alpha('#000', 0.6) }}>
                  Transformed Path Levels
                </Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {renderLevelSelect('level1', newMapping.level1, levelOptions.level1)}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {renderLevelSelect('level2', newMapping.level2, levelOptions.level2)}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {renderLevelSelect('level3', newMapping.level3, levelOptions.level3)}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {renderLevelSelect('level4', newMapping.level4, levelOptions.level4)}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {renderLevelSelect('level5', newMapping.level5, levelOptions.level5)}
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: '8px',
                mt: 1
              }}>
                <Typography variant="subtitle2">
                  Transformed Path: 
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 0.5,
                    fontFamily: 'monospace',
                    wordBreak: 'break-all' 
                  }}
                >
                  {getFullPath(newMapping) || '(Empty path)'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveMapping}
            variant="contained" 
            startIcon={<SaveIcon />}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              ml: 2,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              }
            }}
          >
            {editingMapping ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding new option to level */}
      <Dialog 
        open={openOptionsDialog}
        onClose={handleCloseOptionsDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Add New Option to {addingNewOption.level?.replace('level', 'Level ')}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            label="New Option Value"
            value={addingNewOption.value}
            onChange={handleOptionInputChange}
            placeholder="Enter new value for this level"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseOptionsDialog}
            variant="outlined"
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddNewOption}
            variant="contained"
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              ml: 2,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              }
            }}
          >
            Add Option
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default XDMPathMapping; 