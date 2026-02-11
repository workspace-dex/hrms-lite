import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

const drawerWidth = 200;
const collapsedWidth = 60;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Employees', icon: <PeopleIcon />, path: '/employees' },
  { text: 'Attendance', icon: <EventNoteIcon />, path: '/attendance' },
];

function Navigation({ open, toggleDrawer }) {
  const location = useLocation();
  
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        transition: 'width 0.3s',
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s',
          overflowX: 'hidden',
          bgcolor: '#1a1a2e',
          color: '#fff',
        },
      }}
    >
      <Toolbar sx={{ justifyContent: open ? 'space-between' : 'center', px: 1 }}>
        {open && (
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: '#fff' }}>
            HRMS
          </Typography>
        )}
        <IconButton onClick={toggleDrawer} sx={{ color: '#fff' }}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <Tooltip title={!open ? item.text : ''} placement="right" key={item.text}>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  color: '#fff',
                  '&.Mui-selected': {
                    bgcolor: '#16213e',
                  },
                  '&:hover': {
                    bgcolor: '#0f3460',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
}

function App() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerOpen ? drawerWidth : collapsedWidth}px)`,
            ml: `${drawerOpen ? drawerWidth : collapsedWidth}px`,
            transition: 'width 0.3s, margin 0.3s',
            bgcolor: '#16213e',
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Human Resource Management System
            </Typography>
          </Toolbar>
        </AppBar>
        <Navigation open={drawerOpen} toggleDrawer={toggleDrawer} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: '#0f0f1e',
            minHeight: '100vh',
            p: 3,
            pt: 10,
            transition: 'margin 0.3s',
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
