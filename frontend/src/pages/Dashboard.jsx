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
        <CircularProgress sx={{ color: '#e94560' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography sx={{ color: '#e94560' }}>{error}</Typography>
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.total_employees || 0,
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#e94560' }} />,
      bgColor: '#16213e',
    },
    {
      title: 'Present Today',
      value: stats?.present_today || 0,
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: '#0ea5e9' }} />,
      bgColor: '#16213e',
    },
    {
      title: 'Absent Today',
      value: stats?.absent_today || 0,
      icon: <CancelIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
      bgColor: '#16213e',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#fff', fontWeight: 300 }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={0} sx={{ bgcolor: card.bgColor, borderRadius: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem', mb: 1 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" component="div" sx={{ color: '#fff', fontWeight: 600 }}>
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
        <Card elevation={0} sx={{ bgcolor: '#16213e', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 3 }}>
              Quick Actions
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip 
                label="Manage Employees" 
                onClick={() => window.location.href = '/employees'}
                sx={{ 
                  cursor: 'pointer', 
                  bgcolor: '#0f3460', 
                  color: '#fff',
                  '&:hover': { bgcolor: '#e94560' }
                }}
              />
              <Chip 
                label="Mark Attendance" 
                onClick={() => window.location.href = '/attendance'}
                sx={{ 
                  cursor: 'pointer', 
                  bgcolor: '#0f3460', 
                  color: '#fff',
                  '&:hover': { bgcolor: '#0ea5e9' }
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
