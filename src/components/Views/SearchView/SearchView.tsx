import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  alpha,
  useTheme,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ViewQuilt as ViewQuiltIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  relevance: number;
  icon: string;
}

const sampleResults: SearchResult[] = [
  {
    id: '1',
    title: 'Customer Data Analysis',
    description: 'Analysis of customer behavior patterns and preferences',
    category: 'Analytics',
    date: '2023-05-15',
    relevance: 95,
    icon: '📊',
  },
  {
    id: '2',
    title: 'Product Performance Report',
    description: 'Quarterly report on product performance metrics',
    category: 'Reports',
    date: '2023-06-22',
    relevance: 88,
    icon: '📈',
  },
  {
    id: '3',
    title: 'User Engagement Metrics',
    description: 'Detailed metrics on user engagement across platforms',
    category: 'Metrics',
    date: '2023-07-10',
    relevance: 92,
    icon: '👥',
  },
  {
    id: '4',
    title: 'Marketing Campaign Results',
    description: 'Results from the Q2 marketing campaign',
    category: 'Marketing',
    date: '2023-08-05',
    relevance: 85,
    icon: '📢',
  },
  {
    id: '5',
    title: 'Sales Forecast Model',
    description: 'AI-powered sales forecasting model',
    category: 'Models',
    date: '2023-09-12',
    relevance: 90,
    icon: '🤖',
  },
  {
    id: '6',
    title: 'Customer Feedback Analysis',
    description: 'Analysis of customer feedback from surveys',
    category: 'Feedback',
    date: '2023-10-18',
    relevance: 87,
    icon: '💬',
  },
];

const SearchView: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'compact'>('list');
  const [sortBy, setSortBy] = useState('relevance');
  const [category, setCategory] = useState('all');
  const [results, setResults] = useState<SearchResult[]>(sampleResults);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // In a real app, this would trigger a search API call
    // For now, we'll just filter the sample results
    if (event.target.value) {
      const filtered = sampleResults.filter(
        result => 
          result.title.toLowerCase().includes(event.target.value.toLowerCase()) ||
          result.description.toLowerCase().includes(event.target.value.toLowerCase()) ||
          result.category.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(sampleResults);
    }
  };

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newMode: 'list' | 'grid' | 'compact') => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
    // In a real app, this would trigger a sort API call
    // For now, we'll just sort the results
    const sorted = [...results].sort((a, b) => {
      switch (event.target.value) {
        case 'relevance':
          return b.relevance - a.relevance;
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    setResults(sorted);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
    // In a real app, this would trigger a filter API call
    // For now, we'll just filter the results
    if (event.target.value === 'all') {
      setResults(sampleResults);
    } else {
      const filtered = sampleResults.filter(
        result => result.category.toLowerCase() === event.target.value.toLowerCase()
      );
      setResults(filtered);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setResults(sampleResults);
  };

  const renderResultItem = (result: SearchResult) => (
    <ListItem
      sx={{
        borderRadius: '8px',
        mb: 1,
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.08),
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 20px ${alpha('#000', 0.08)}`,
        }
      }}
    >
      <ListItemIcon>
        <Avatar sx={{ 
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          width: 40,
          height: 40,
          fontSize: '1.2rem',
        }}>
          {result.icon}
        </Avatar>
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: alpha('#000', 0.8) }}>
            {result.title}
          </Typography>
        }
        secondary={
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="body2" sx={{ color: alpha('#000', 0.6), mb: 1 }}>
              {result.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={result.category}
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
              <Typography variant="caption" sx={{ color: alpha('#000', 0.5) }}>
                {result.date}
              </Typography>
              <Chip
                label={`${result.relevance}% Match`}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  fontWeight: 500,
                  '& .MuiChip-label': {
                    px: 1.5,
                    fontSize: '0.75rem'
                  }
                }}
              />
            </Box>
          </Box>
        }
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="more">
          <MoreVertIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );

  const renderResultGrid = (result: SearchResult) => (
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
        <Avatar sx={{ 
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          width: 40,
          height: 40,
          fontSize: '1.2rem',
        }}>
          {result.icon}
        </Avatar>
        <IconButton size="small">
          <MoreVertIcon />
        </IconButton>
      </Box>
      <Typography variant="h6" sx={{ 
        fontSize: '1rem',
        fontWeight: 600,
        color: alpha('#000', 0.8),
        mb: 1
      }}>
        {result.title}
      </Typography>
      <Typography variant="body2" sx={{ 
        color: alpha('#000', 0.6),
        fontSize: '0.875rem',
        mb: 2,
        flex: 1
      }}>
        {result.description}
      </Typography>
      <Box sx={{ 
        mt: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Chip
          label={result.category}
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
        <Typography variant="caption" sx={{ color: alpha('#000', 0.5) }}>
          {result.date}
        </Typography>
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
            Search
          </Typography>
          <Typography variant="body1" sx={{ 
            color: alpha('#000', 0.6),
            fontSize: '0.875rem'
          }}>
            Find and explore your data
          </Typography>
        </Box>
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
          Export Results
        </Button>
      </Box>

      {/* Search Bar */}
      <Paper
        sx={{
          p: 2,
          borderRadius: '12px',
          boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.08),
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search for anything..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
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
                  <SearchIcon sx={{ color: alpha('#000', 0.4) }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={handleClearSearch}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              px: 3,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              }
            }}
          >
            Search
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="analytics">Analytics</MenuItem>
                <MenuItem value="reports">Reports</MenuItem>
                <MenuItem value="metrics">Metrics</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="models">Models</MenuItem>
                <MenuItem value="feedback">Feedback</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
              >
                <MenuItem value="relevance">Relevance</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="title">Title</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  px: 1.5,
                  py: 0.5,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    }
                  }
                }
              }}
            >
              <ToggleButton value="list">
                <Tooltip title="List View">
                  <ViewListIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="grid">
                <Tooltip title="Grid View">
                  <ViewModuleIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="compact">
                <Tooltip title="Compact View">
                  <ViewQuiltIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
            <IconButton size="small">
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Results */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {results.length > 0 ? (
          viewMode === 'list' ? (
            <List>
              {results.map((result) => (
                <React.Fragment key={result.id}>
                  {renderResultItem(result)}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Grid container spacing={2}>
              {results.map((result) => (
                <Grid item xs={12} sm={6} md={4} key={result.id}>
                  {renderResultGrid(result)}
                </Grid>
              ))}
            </Grid>
          )
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            py: 8
          }}>
            <SearchIcon sx={{ fontSize: 60, color: alpha('#000', 0.1), mb: 2 }} />
            <Typography variant="h6" sx={{ color: alpha('#000', 0.6), mb: 1 }}>
              No results found
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#000', 0.5) }}>
              Try adjusting your search criteria
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SearchView; 