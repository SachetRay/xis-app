import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, styled } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CodeIcon from '@mui/icons-material/Code';
import ShieldIcon from '@mui/icons-material/Shield';
import GroupsIcon from '@mui/icons-material/Groups';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ChatIcon from '@mui/icons-material/Chat';

const StyledDrawer = styled(Drawer)({
  width: 240,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 240,
    boxSizing: 'border-box',
    backgroundColor: '#f5f5f5',
  },
});

const menuItems = [
  { text: 'Home', icon: <HomeIcon sx={{ color: '#4CAF50' }} /> },
  { text: 'Data Wizard', icon: <AutoFixHighIcon sx={{ color: '#673AB7' }} /> },
  { text: 'Dev Toolbox', icon: <CodeIcon sx={{ color: '#FF9800' }} /> },
  { text: 'Data Guardian', icon: <ShieldIcon sx={{ color: '#2196F3' }} /> },
  { text: 'SegmentGenie', icon: <GroupsIcon sx={{ color: '#9C27B0' }} /> },
  { text: 'Resource IQ', icon: <Inventory2Icon sx={{ color: '#F44336' }} /> },
  { text: 'Document Hub', icon: <MenuBookIcon sx={{ color: '#00BCD4' }} /> },
  { text: 'Ask DGP', icon: <ChatIcon sx={{ color: '#795548' }} /> },
];

const Sidebar = () => {
  return (
    <StyledDrawer variant="permanent">
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default Sidebar; 