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
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Speed as SpeedIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
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
} from 'recharts';

// Sample data for charts
const performanceData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const userActivityData = [
  { name: 'Mon', active: 4000, total: 5000 },
  { name: 'Tue', active: 3000, total: 4000 },
  { name: 'Wed', active: 2000, total: 3000 },
  { name: 'Thu', active: 2780, total: 3500 },
  { name: 'Fri', active: 1890, total: 2500 },
  { name: 'Sat', active: 2390, total: 3000 },
  { name: 'Sun', active: 3490, total: 4000 },
];

const metricCards = [
  {
    title: 'Total Users',
    value: '12,345',
    change: '+12.5%',
    trend: 'up',
    icon: <PeopleIcon />,
    color: '#4CAF50'
  },
  {
    title: 'Active Sessions',
    value: '2,345',
    change: '+8.2%',
    trend: 'up',
    icon: <SpeedIcon />,
    color: '#2196F3'
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    change: '-2.1%',
    trend: 'down',
    icon: <TrendingUpIcon />,
    color: '#FF9800'
  },
  {
    title: 'Avg. Response Time',
    value: '245ms',
    change: '-15.3%',
    trend: 'up',
    icon: <SpeedIcon />,
    color: '#9C27B0'
  }
];

const DashboardView: React.FC = () => {
  const theme = useTheme();

  const renderMetricCard = (metric: typeof metricCards[0]) => (
    <Paper
      sx={{
        p: 3,
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
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 2
      }}>
        <Box sx={{ 
          p: 1, 
          borderRadius: '8px',
          backgroundColor: alpha(metric.color, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {React.cloneElement(metric.icon, { sx: { color: metric.color } })}
        </Box>
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
      
      <Typography variant="body2" sx={{ 
        color: alpha('#000', 0.6),
        fontSize: '0.875rem',
        mb: 2
      }}>
        {metric.title}
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        mt: 'auto'
      }}>
        {metric.trend === 'up' ? (
          <ArrowUpwardIcon sx={{ 
            color: theme.palette.success.main,
            fontSize: 16,
            mr: 0.5
          }} />
        ) : (
          <ArrowDownwardIcon sx={{ 
            color: theme.palette.error.main,
            fontSize: 16,
            mr: 0.5
          }} />
        )}
        <Typography variant="body2" sx={{ 
          color: metric.trend === 'up' ? theme.palette.success.main : theme.palette.error.main,
          fontWeight: 500
        }}>
          {metric.change}
        </Typography>
      </Box>
    </Paper>
  );

  const renderChart = (title: string, data: any[], type: 'line' | 'bar' = 'line') => (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.08),
      }}
    >
      <Typography variant="h6" sx={{ 
        mb: 3,
        color: alpha('#000', 0.8),
        fontWeight: 600
      }}>
        {title}
      </Typography>
      
      <Box sx={{ flex: 1, minHeight: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.06)} />
              <XAxis 
                dataKey="name" 
                stroke={alpha('#000', 0.6)}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke={alpha('#000', 0.6)}
                tick={{ fontSize: 12 }}
              />
              <RechartsTooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: `0 2px 12px ${alpha('#000', 0.1)}`,
                  border: 'none'
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
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.06)} />
              <XAxis 
                dataKey="name" 
                stroke={alpha('#000', 0.6)}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke={alpha('#000', 0.6)}
                tick={{ fontSize: 12 }}
              />
              <RechartsTooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: `0 2px 12px ${alpha('#000', 0.1)}`,
                  border: 'none'
                }}
              />
              <Legend />
              <Bar dataKey="active" fill={theme.palette.primary.main} />
              <Bar dataKey="total" fill={alpha(theme.palette.primary.main, 0.3)} />
            </BarChart>
          )}
        </ResponsiveContainer>
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
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ 
            color: alpha('#000', 0.6),
            fontSize: '0.875rem'
          }}>
            Monitor your key metrics and performance indicators
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<BarChartIcon />}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            }
          }}
        >
          Export Report
        </Button>
      </Box>

      {/* Metric Cards */}
      <Grid container spacing={3}>
        {metricCards.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            {renderMetricCard(metric)}
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderChart('Performance Trends', performanceData, 'line')}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderChart('User Activity', userActivityData, 'bar')}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardView; 