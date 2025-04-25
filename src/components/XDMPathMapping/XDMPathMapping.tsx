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
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Search as SearchIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { userData } from '../../data/userData';
import { transformedUserData } from '../../data/transformedUserData';
import { updateTransformedData } from '../../utils/userDataTransformer';

// Interface for XDM path mapping
interface PathMapping {
  id: string;
  xdmPath: string;  // Original path from userData
  level1: string;   // Transformed path from transformedUserData
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

// Function to split a path into levels
const splitPathIntoLevels = (path: string): { [key: string]: string } => {
  const levels = path.split('/');
  return {
    level1: levels[0] || '',
    level2: levels[1] || '',
    level3: levels[2] || '',
    level4: levels[3] || '',
    level5: levels[4] || '',
  };
};

const XDMPathMapping: React.FC = () => {
  const theme = useTheme();
  
  // Extract leaf node paths from userData and transformedUserData
  const xdmPaths = useMemo(() => extractXDMPaths(userData), []);
  const transformedPaths = useMemo(() => extractTransformedPaths(transformedUserData), []);
  
  // Create initial mappings by matching values
  const initialMappings = useMemo(() => {
    return xdmPaths.map((xdmPath, index) => {
      const xdmValue = getValueAtPath(userData, xdmPath);
      const transformedPath = findMatchingTransformedPath(xdmPath, xdmValue, transformedPaths);
      const levels = splitPathIntoLevels(transformedPath);
      
      return {
        id: `${index}`,
        xdmPath,
        ...levels
      } as PathMapping;
    });
  }, [xdmPaths, transformedPaths]);

  const [mappings, setMappings] = useState<PathMapping[]>(initialMappings);
  const [filteredMappings, setFilteredMappings] = useState<PathMapping[]>(initialMappings);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMapping, setEditingMapping] = useState<PathMapping | null>(null);
  const [newMapping, setNewMapping] = useState<PathMapping>({
    id: '',
    xdmPath: '',
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
      level1: new Set<string>(),
      level2: new Set<string>(),
      level3: new Set<string>(),
      level4: new Set<string>(),
      level5: new Set<string>()
    };

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
        level1: '',
        level2: '',
        level3: '',
        level4: '',
        level5: ''
      });
    }
  }, [openDialog]);

  const handleOpenDialog = (mapping?: PathMapping) => {
    if (mapping) {
      setEditingMapping(mapping);
      setNewMapping({ ...mapping });
    } else {
      setEditingMapping(null);
      setNewMapping({
        id: Date.now().toString(),
        xdmPath: '',
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
    setNewMapping(prev => ({ ...prev, [name]: value }));
  };

  // Modified handleSaveMapping to update transformedUserData
  const handleSaveMapping = () => {
    if (!newMapping.level1) {
      setSnackbar({
        open: true,
        message: 'Level 1 is required',
        severity: 'error'
      });
      return;
    }

    if (editingMapping) {
      // Create the new transformed path
      const newTransformedPath = [
        newMapping.level1,
        newMapping.level2,
        newMapping.level3,
        newMapping.level4,
        newMapping.level5
      ].filter(Boolean).join('/');

      // Update the mapping in state
      setMappings(mappings.map(m => {
        if (m.id === editingMapping.id) {
          // Update transformedUserData
          const updatedData = updateTransformedData(
            m.xdmPath,
            newTransformedPath,
            transformedUserData
          );

          // Dispatch a custom event to notify DataWizard
          const event = new CustomEvent('transformedDataUpdated', {
            detail: { updatedData }
          });
          window.dispatchEvent(event);

          return newMapping;
        }
        return m;
      }));

      setSnackbar({
        open: true,
        message: 'Mapping updated successfully',
        severity: 'success'
      });
    }
    
    handleCloseDialog();
  };

  // Disable the ability to add new mappings since they should come from userData
  const handleDeleteMapping = () => {
    setSnackbar({
      open: true,
      message: 'Mappings cannot be deleted as they are derived from user data',
      severity: 'warning'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Generate the full path from the levels
  const getFullPath = (mapping: PathMapping) => {
    return [mapping.level1, mapping.level2, mapping.level3, mapping.level4, mapping.level5]
      .filter(Boolean)
      .join('/');
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
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  width: '25%',
                  padding: '16px',
                  backgroundColor: alpha(theme.palette.primary.main, 0.05) 
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
                  backgroundColor: alpha(theme.palette.primary.main, 0.05) 
                }}>Level 1</TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  padding: '16px',
                  backgroundColor: alpha(theme.palette.primary.main, 0.05) 
                }}>Level 2</TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  padding: '16px',
                  backgroundColor: alpha(theme.palette.primary.main, 0.05) 
                }}>Level 3</TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  padding: '16px',
                  backgroundColor: alpha(theme.palette.primary.main, 0.05) 
                }}>Level 4</TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  padding: '16px',
                  backgroundColor: alpha(theme.palette.primary.main, 0.05) 
                }}>Level 5</TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  width: '20%',
                  padding: '16px',
                  backgroundColor: alpha(theme.palette.primary.main, 0.05) 
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
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
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
                      <IconButton 
                        size="small" 
                        onClick={handleDeleteMapping}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <DeleteIcon fontSize="small" />
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