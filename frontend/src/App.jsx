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

const drawerWidth = 260;
const collapsedWidth = 72;

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
        transition: 'width 0.3s ease-in-out',
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
          bgcolor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Toolbar sx={{ 
        justifyContent: open ? 'space-between' : 'center', 
        px: 2,
        borderBottom: '1px solid #e2e8f0',
        minHeight: '64px',
      }}>
        {open && (
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              fontWeight: 700,
              color: '#1e293b',
              letterSpacing: '0.5px',
            }}
          >
            HRMS
          </Typography>
        )}
        <IconButton 
          onClick={toggleDrawer} 
          sx={{ 
            color: '#64748b',
            '&:hover': { color: '#334155', bgcolor: '#f1f5f9' }
          }}
        >
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <Tooltip title={!open ? item.text : ''} placement="right" key={item.text}>
            <ListItem disablePadding sx={{ px: 1, mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: open ? 2 : 1.5,
                  borderRadius: 1,
                  mx: 1,
                  color: '#64748b',
                  '&.Mui-selected': {
                    color: '#0f172a',
                    bgcolor: '#f1f5f9',
                    '& .MuiListItemIcon-root': { color: '#2563eb' },
                  },
                  '&:hover': {
                    bgcolor: '#f8fafc',
                    color: '#334155',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: location.pathname === item.path ? '#2563eb' : '#64748b', 
                    minWidth: 0, 
                    mr: open ? 2 : 0,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: location.pathname === item.path ? 600 : 500,
                    }}
                  />
                )}
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
          elevation={0}
          sx={{
            width: `calc(100% - ${drawerOpen ? drawerWidth : collapsedWidth}px)`,
            ml: `${drawerOpen ? drawerWidth : collapsedWidth}px`,
            transition: 'width 0.3s ease-in-out, margin 0.3s ease-in-out',
            bgcolor: '#1e293b',
            borderBottom: '1px solid #334155',
          }}
        >
          <Toolbar sx={{ minHeight: '64px' }}>
            <Typography 
              variant="h5" 
              component="div"
              sx={{
                fontWeight: 600,
                letterSpacing: '0.5px',
                color: '#f8fafc',
                textTransform: 'uppercase',
              }}
            >
              Human Resource Management System
            </Typography>
          </Toolbar>
        </AppBar>
        <Navigation open={drawerOpen} toggleDrawer={toggleDrawer} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: '#f8fafc',
            minHeight: '100vh',
            p: 4,
            pt: 10,
            transition: 'margin 0.3s ease-in-out',
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
