import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, alpha, useTheme, Divider } from '@mui/material';
import XDMPathMapping from '../../XDMPathMapping/XDMPathMapping';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      style={{ height: '100%' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
};

const SettingsView = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'row', 
      height: '100%',
      bgcolor: 'background.default'
    }}>
      <Paper 
        elevation={0} 
        sx={{ 
          width: 240, 
          borderRight: 1, 
          borderColor: alpha(theme.palette.divider, 0.1),
          overflow: 'auto',
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ p: 3, mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Settings
          </Typography>
        </Box>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tabValue}
          onChange={handleTabChange}
          aria-label="settings tabs"
          sx={{
            '& .MuiTab-root': {
              alignItems: 'center',
              justifyContent: 'flex-start',
              textAlign: 'left',
              py: 2,
              px: 3,
              minHeight: 'auto',
              gap: 2,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              }
            },
            '& .MuiTabs-indicator': {
              left: 0,
              right: 'auto',
              width: 3,
              borderTopRightRadius: 3,
              borderBottomRightRadius: 3,
            }
          }}
        >
          <Tab 
            icon={<SettingsIcon />} 
            iconPosition="start" 
            label={<Box sx={{ textAlign: 'left', width: '100%' }}>General Settings</Box>}
            {...a11yProps(0)} 
            sx={{ textTransform: 'none' }}
          />
          <Tab 
            icon={<AccountTreeIcon />} 
            iconPosition="start" 
            label={<Box sx={{ textAlign: 'left', width: '100%' }}>XDM Path Mapping</Box>}
            {...a11yProps(1)} 
            sx={{ textTransform: 'none' }}
          />
          <Tab 
            icon={<SecurityIcon />} 
            iconPosition="start" 
            label={<Box sx={{ textAlign: 'left', width: '100%' }}>Security & Access</Box>}
            {...a11yProps(2)} 
            sx={{ textTransform: 'none' }}
          />
          <Tab 
            icon={<StorageIcon />} 
            iconPosition="start" 
            label={<Box sx={{ textAlign: 'left', width: '100%' }}>Data Storage</Box>}
            {...a11yProps(3)} 
            sx={{ textTransform: 'none' }}
          />
        </Tabs>
      </Paper>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>General Settings</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Coming soon...
            </Typography>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <XDMPathMapping />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>Security & Access</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Coming soon...
            </Typography>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>Data Storage</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Coming soon...
            </Typography>
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default SettingsView; 