import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  useTheme,
  alpha,
  useMediaQuery,
  Tooltip,
  Divider,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CodeIcon from '@mui/icons-material/Code';
import ShieldIcon from '@mui/icons-material/Shield';
import GroupsIcon from '@mui/icons-material/Groups';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ChatIcon from '@mui/icons-material/Chat';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { FEATURES } from '../../config/config';

const expandedWidth = 240;
const collapsedWidth = 65;

const menuItems = [
  { 
    text: 'Home', 
    icon: <HomeIcon />, 
    path: '/home',
    color: '#4CAF50' // Green
  },
  { 
    text: 'Data Wizard', 
    icon: <AutoFixHighIcon />, 
    path: '/data-wizard',
    color: '#673AB7' // Deep Purple
  },
  { 
    text: 'Dev Toolbox', 
    icon: <CodeIcon />, 
    path: '/dev-toolbox',
    color: '#FF9800' // Orange
  },
  { 
    text: 'Data Guardian', 
    icon: <ShieldIcon />, 
    path: '/data-guardian',
    color: '#2196F3' // Blue
  },
  { 
    text: 'SegmentGenie', 
    icon: <GroupsIcon />, 
    path: '/segment-genie',
    color: '#9C27B0' // Purple
  },
  { 
    text: 'Resource IQ', 
    icon: <Inventory2Icon />, 
    path: '/resource-iq',
    color: '#F44336' // Red
  },
  { 
    text: 'Document Hub', 
    icon: <MenuBookIcon />, 
    path: '/document-hub',
    color: '#00BCD4' // Cyan
  },
  { 
    text: 'Ask DGP', 
    icon: <ChatIcon />, 
    path: '/ask-dgp',
    color: '#795548' // Brown
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)',
      pt: '64px' // Add padding top to account for the AppBar
    }}>
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname.startsWith(item.path);
          return (
            <Tooltip 
              key={item.text}
              title={!isExpanded ? item.text : ""}
              placement="right"
              arrow
            >
              <ListItem
                button
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) {
                    setMobileOpen(false);
                  }
                }}
                sx={{
                  my: 0.5,
                  borderRadius: '12px',
                  transition: 'all 0.2s ease-in-out',
                  backgroundColor: isSelected ? alpha(item.color, 0.1) : 'transparent',
                  color: isSelected ? item.color : alpha(theme.palette.text.primary, 0.7),
                  minHeight: 48,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: !isExpanded ? 'center' : 'flex-start',
                  '&:hover': {
                    backgroundColor: alpha(item.color, 0.08),
                    transform: 'translateX(4px)',
                    '& .MuiListItemIcon-root': {
                      transform: 'scale(1.1)',
                    }
                  },
                  textAlign: 'left',
                  '& .MuiListItemText-root': {
                    textAlign: 'left',
                    marginLeft: 0
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isSelected ? item.color : alpha(item.color, 0.7),
                    minWidth: isExpanded ? 36 : 'auto',
                    mr: isExpanded ? 2 : 0,
                    transition: 'all 0.2s ease-in-out',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                    filter: isSelected ? 'drop-shadow(0px 2px 3px rgba(0,0,0,0.1))' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: !isExpanded ? '100%' : 'auto',
                    '& .MuiSvgIcon-root': {
                      fontSize: 24,
                    }
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {isExpanded && (
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: isSelected ? 600 : 500,
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease-in-out',
                        textAlign: 'left'
                      }
                    }}
                  />
                )}
              </ListItem>
            </Tooltip>
          );
        })}
      </List>
      
      {/* Collapse button */}
      <Box sx={{ 
        p: 2,
        display: 'flex', 
        justifyContent: 'center'
      }}>
        <Button
          variant="contained"
          onClick={handleExpandToggle}
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            borderRadius: '12px',
            width: '100%',
            py: 1,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.15),
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {isExpanded ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ChevronLeftIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Collapse Menu
              </Typography>
            </Box>
          ) : (
            <ChevronRightIcon fontSize="small" />
          )}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Xperience Intelligence Studio
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { xs: 0, md: isExpanded ? expandedWidth : collapsedWidth },
          flexShrink: { md: 0 },
          borderRight: '1px solid',
          borderColor: 'divider',
          display: { xs: mobileOpen ? 'block' : 'none', md: 'block' },
          position: 'fixed',
          height: '100vh',
          zIndex: 1200,
          bgcolor: 'background.paper',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: expandedWidth,
              backgroundColor: 'background.paper',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: isExpanded ? expandedWidth : collapsedWidth,
              backgroundColor: 'background.paper',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${isExpanded ? expandedWidth : collapsedWidth}px)` },
          marginLeft: { md: `${isExpanded ? expandedWidth : collapsedWidth}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          height: '100vh',
          overflow: 'auto',
          paddingTop: '88px', // Account for AppBar + some padding
        }}
      >
        {/* Demo mode indicator - moved to bottom right */}
        {FEATURES.showDemoIndicator && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1300,
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
              px: 2,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 'bold',
              boxShadow: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>DEMO MODE</Typography>
          </Box>
        )}
        
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: theme.zIndex.drawer + 2,
            background: 'linear-gradient(90deg, #3f51b5 0%, #5c6bc0 50%, #7986cb 100%)',
            color: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            width: '100%',
            left: 0,
            right: 0,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  {mobileOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AutoAwesomeIcon sx={{ 
                  color: 'white',
                  fontSize: 28,
                  filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))'
                }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    textShadow: '0px 1px 2px rgba(0,0,0,0.2)',
                    fontSize: '1.25rem'
                  }}
                >
                  Xperience Intelligence Studio
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button 
                variant="contained" 
                color="secondary"
                startIcon={<ChatIcon />}
                onClick={() => navigate('/ask-dgp')}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Ask DGP
              </Button>
              <Box 
                onClick={handleUserMenuOpen}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'transparent',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                >
                  S
                </Avatar>
                <Typography
                  sx={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                >
                  Sachet
                </Typography>
              </Box>
              
              {/* User Menu */}
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    '& .MuiMenuItem-root': {
                      py: 1.5,
                      px: 2,
                    }
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => {
                  handleUserMenuClose();
                  // Navigate to profile page (if you have one)
                }}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                  handleUserMenuClose();
                  navigate('/settings');
                }}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleUserMenuClose}>
                  <ListItemIcon>
                    <ExitToAppIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {children}
      </Box>
    </Box>
  );
};

export default Layout; 