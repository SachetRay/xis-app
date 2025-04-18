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
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  TableChart as TableChartIcon,
  Map as MapIcon,
  List as ListIcon,
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Widget {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'table' | 'map' | 'list';
  data: any[];
  config: {
    width: number;
    height: number;
  };
}

const sampleData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const sampleWidgets: Widget[] = [
  {
    id: '1',
    title: 'Monthly Performance',
    type: 'line',
    data: sampleData,
    config: { width: 6, height: 4 },
  },
  {
    id: '2',
    title: 'Revenue Distribution',
    type: 'pie',
    data: sampleData,
    config: { width: 4, height: 4 },
  },
  {
    id: '3',
    title: 'User Growth',
    type: 'bar',
    data: sampleData,
    config: { width: 6, height: 4 },
  },
];

const WidgetsView: React.FC = () => {
  const theme = useTheme();
  const [widgets, setWidgets] = useState<Widget[]>(sampleWidgets);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, widgetId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedWidget(widgetId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWidget(null);
  };

  const getWidgetIcon = (type: Widget['type']) => {
    switch (type) {
      case 'line':
        return <TimelineIcon />;
      case 'bar':
        return <BarChartIcon />;
      case 'pie':
        return <PieChartIcon />;
      case 'table':
        return <TableChartIcon />;
      case 'map':
        return <MapIcon />;
      case 'list':
        return <ListIcon />;
      default:
        return null;
    }
  };

  const renderChart = (widget: Widget) => {
    switch (widget.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={widget.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={widget.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="value" fill={theme.palette.primary.main} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={widget.data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {widget.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const renderWidget = (widget: Widget) => (
    <Grid item xs={12} md={widget.config.width} key={widget.id}>
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
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 20px ${alpha('#000', 0.08)}`,
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              p: 1, 
              borderRadius: '8px',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getWidgetIcon(widget.type)}
            </Box>
            <Typography variant="h6" sx={{ 
              fontSize: '1rem',
              fontWeight: 600,
              color: alpha('#000', 0.8)
            }}>
              {widget.title}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => handleMenuOpen(e, widget.id)}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1 }}>
          {renderChart(widget)}
        </Box>
      </Paper>
    </Grid>
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
            Widgets
          </Typography>
          <Typography variant="body1" sx={{ 
            color: alpha('#000', 0.6),
            fontSize: '0.875rem'
          }}>
            Customize your dashboard with widgets
          </Typography>
        </Box>
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
          Add Widget
        </Button>
      </Box>

      {/* Widgets Grid */}
      <Grid container spacing={3}>
        {widgets.map(renderWidget)}
      </Grid>

      {/* Widget Actions Menu */}
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
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Widget</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Configure</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Widget</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default WidgetsView; 