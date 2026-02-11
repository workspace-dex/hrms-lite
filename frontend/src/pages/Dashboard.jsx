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
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.total_employees || 0,
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary',
    },
    {
      title: 'Present Today',
      value: stats?.present_today || 0,
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success',
    },
    {
      title: 'Absent Today',
      value: stats?.absent_today || 0,
      icon: <CancelIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      color: 'error',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" component="div">
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
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip 
                label="Manage Employees" 
                color="primary" 
                onClick={() => window.location.href = '/employees'}
                sx={{ cursor: 'pointer' }}
              />
              <Chip 
                label="Mark Attendance" 
                color="secondary" 
                onClick={() => window.location.href = '/attendance'}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Dashboard;
