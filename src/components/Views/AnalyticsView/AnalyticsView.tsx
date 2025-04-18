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
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample data for charts
const performanceData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
];

const userActivityData = [
  { name: 'Mon', active: 2400, inactive: 4000 },
  { name: 'Tue', active: 1398, inactive: 3000 },
  { name: 'Wed', active: 9800, inactive: 2000 },
  { name: 'Thu', active: 3908, inactive: 2780 },
  { name: 'Fri', active: 4800, inactive: 1890 },
  { name: 'Sat', active: 3800, inactive: 2390 },
  { name: 'Sun', active: 4300, inactive: 3490 },
];

const distributionData = [
  { name: 'Category A', value: 400 },
  { name: 'Category B', value: 300 },
  { name: 'Category C', value: 300 },
  { name: 'Category D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const metricCards = [
  {
    title: 'Total Users',
    value: '12,345',
    trend: '+12.5%',
    isPositive: true,
    icon: <TrendingUpIcon />,
  },
  {
    title: 'Active Sessions',
    value: '2,345',
    trend: '-2.3%',
    isPositive: false,
    icon: <TrendingDownIcon />,
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    trend: '+0.8%',
    isPositive: true,
    icon: <TrendingUpIcon />,
  },
  {
    title: 'Avg. Session Duration',
    value: '4m 32s',
    trend: '+1.2%',
    isPositive: true,
    icon: <TrendingUpIcon />,
  },
];

const AnalyticsView: React.FC = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('7d');
  const [chartType, setChartType] = useState('line');

  const handleTimeRangeChange = (event: React.MouseEvent<HTMLElement>, newTimeRange: string) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  const handleChartTypeChange = (event: React.MouseEvent<HTMLElement>, newChartType: string) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  const renderMetricCard = (metric: typeof metricCards[0]) => (
    <Card
      sx={{
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
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ 
            color: alpha('#000', 0.6),
            fontSize: '0.875rem'
          }}>
            {metric.title}
          </Typography>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography variant="h4" sx={{ 
          fontWeight: 600,
          color: alpha('#000', 0.8),
          mb: 1
        }}>
          {metric.value}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1
        }}>
          <Chip
            icon={metric.icon}
            label={metric.trend}
            size="small"
            sx={{
              backgroundColor: alpha(metric.isPositive ? theme.palette.success.main : theme.palette.error.main, 0.1),
              color: metric.isPositive ? theme.palette.success.main : theme.palette.error.main,
              fontWeight: 500,
              '& .MuiChip-label': {
                px: 1.5,
                fontSize: '0.75rem'
              }
            }}
          />
          <Typography variant="caption" sx={{ color: alpha('#000', 0.6) }}>
            vs last period
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderChart = (data: any[], type: 'line' | 'bar' | 'pie') => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.1)} />
              <XAxis dataKey="name" stroke={alpha('#000', 0.6)} />
              <YAxis stroke={alpha('#000', 0.6)} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: `0 2px 12px ${alpha('#000', 0.1)}`,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={{ fill: theme.palette.primary.main }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.1)} />
              <XAxis dataKey="name" stroke={alpha('#000', 0.6)} />
              <YAxis stroke={alpha('#000', 0.6)} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: `0 2px 12px ${alpha('#000', 0.1)}`,
                }}
              />
              <Legend />
              <Bar dataKey="active" fill={theme.palette.primary.main} />
              <Bar dataKey="inactive" fill={theme.palette.secondary.main} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: `0 2px 12px ${alpha('#000', 0.1)}`,
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

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
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" sx={{ 
            color: alpha('#000', 0.6),
            fontSize: '0.875rem'
          }}>
            Monitor and analyze your data
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                px: 2,
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
            <ToggleButton value="24h">24h</ToggleButton>
            <ToggleButton value="7d">7d</ToggleButton>
            <ToggleButton value="30d">30d</ToggleButton>
            <ToggleButton value="90d">90d</ToggleButton>
          </ToggleButtonGroup>
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
        </Box>
      </Box>

      {/* Metric Cards */}
      <Grid container spacing={2}>
        {metricCards.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            {renderMetricCard(metric)}
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '12px',
              boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
            }}
          >
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h6" sx={{ 
                color: alpha('#000', 0.8),
                fontWeight: 600
              }}>
                Performance Overview
              </Typography>
              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={handleChartTypeChange}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    px: 2,
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
                <ToggleButton value="line">Line</ToggleButton>
                <ToggleButton value="bar">Bar</ToggleButton>
                <ToggleButton value="pie">Pie</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            {renderChart(performanceData, chartType as 'line' | 'bar' | 'pie')}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '12px',
              boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
            }}
          >
            <Typography variant="h6" sx={{ 
              color: alpha('#000', 0.8),
              fontWeight: 600,
              mb: 2
            }}>
              User Activity
            </Typography>
            {renderChart(userActivityData, 'bar')}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '12px',
              boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
            }}
          >
            <Typography variant="h6" sx={{ 
              color: alpha('#000', 0.8),
              fontWeight: 600,
              mb: 2
            }}>
              Data Distribution
            </Typography>
            {renderChart(distributionData, 'pie')}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsView; 