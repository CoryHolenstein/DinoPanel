import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PetsIcon from '@mui/icons-material/Pets';
import ViewListIcon from '@mui/icons-material/ViewList';
import SettingsIcon from '@mui/icons-material/Settings';
import AppBarComponent from '../components/AppBar';
import DinoTab from '../tabs/DinoTab';
import DashboardTab from '../tabs/DashboardTab';
import DinosTab from '../tabs/DinosTab';
import DummyTab from '../tabs/DummyTab';

const drawerWidth = 240;

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, component: DashboardTab },
  { id: 'dino', label: 'Live Dino', icon: <PetsIcon />, component: DinoTab },
  { id: 'dinos', label: 'My Dinosaurs', icon: <ViewListIcon />, component: DinosTab },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon />, component: DummyTab },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('dino');

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || DinoTab;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0a0a0a' }}>
      <AppBarComponent />
      
      {/* Sidebar Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#1a1a1a',
            borderRight: '1px solid #2a2a2a',
            marginTop: '64px',
            height: 'calc(100vh - 64px)',
          },
        }}
      >
        <List>
          {tabs.map((tab) => (
            <ListItem key={tab.id} disablePadding>
              <ListItemButton
                selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: '#1b4d3e',
                    '&:hover': {
                      bgcolor: '#2a7056'
                    }
                  },
                  '&:hover': {
                    bgcolor: '#2a2a2a'
                  }
                }}
              >
                <ListItemIcon sx={{ color: activeTab === tab.id ? '#4caf50' : '#9e9e9e' }}>
                  {tab.icon}
                </ListItemIcon>
                <ListItemText primary={tab.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#0a0a0a',
          color: '#fff',
          marginLeft: `${drawerWidth}px`,
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          overflow: 'hidden',
        }}
      >
        <ActiveComponent />
      </Box>
    </Box>
  );
}
