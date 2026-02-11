import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { getDashboardStats } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress sx={{ color: '#2563eb' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography sx={{ color: '#ef4444' }}>{error}</Typography>
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.total_employees || 0,
      icon: <PeopleIcon sx={{ fontSize: 48, color: '#2563eb' }} />,
      borderColor: '#2563eb',
    },
    {
      title: 'Present Today',
      value: stats?.present_today || 0,
      icon: <CheckCircleIcon sx={{ fontSize: 48, color: '#10b981' }} />,
      borderColor: '#10b981',
    },
    {
      title: 'Absent Today',
      value: stats?.absent_today || 0,
      icon: <CancelIcon sx={{ fontSize: 48, color: '#f59e0b' }} />,
      borderColor: '#f59e0b',
    },
  ];

  return (
    <Box>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mb: 4, 
          color: '#1e293b', 
          fontWeight: 600,
          letterSpacing: '0.3px',
        }}
      >
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              elevation={0} 
              sx={{ 
                bgcolor: '#ffffff',
                borderRadius: 2,
                borderLeft: 4,
                borderColor: card.borderColor,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography sx={{ color: '#64748b', fontSize: '0.875rem', mb: 1, fontWeight: 500 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" component="div" sx={{ color: '#1e293b', fontWeight: 700 }}>
                      {card.value}
                    </Typography>
                  </Box>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Card 
          elevation={0} 
          sx={{ 
            bgcolor: '#ffffff',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1e293b', mb: 3, fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip 
                label="Manage Employees" 
                onClick={() => window.location.href = '/employees'}
                sx={{ 
                  cursor: 'pointer', 
                  bgcolor: '#eff6ff', 
                  color: '#2563eb',
                  fontWeight: 500,
                  px: 1,
                  '&:hover': { bgcolor: '#dbeafe' }
                }}
              />
              <Chip 
                label="Mark Attendance" 
                onClick={() => window.location.href = '/attendance'}
                sx={{ 
                  cursor: 'pointer', 
                  bgcolor: '#f0fdf4', 
                  color: '#10b981',
                  fontWeight: 500,
                  px: 1,
                  '&:hover': { bgcolor: '#dcfce7' }
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Dashboard;
