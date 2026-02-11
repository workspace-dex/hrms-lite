import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { getEmployees, createEmployee, deleteEmployee } from '../services/api';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
    hire_date: new Date().toISOString().split('T')[0],
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(emp => 
      emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchQuery, employees]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees();
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      await createEmployee(formData);
      setOpenDialog(false);
      setFormData({ employee_id: '', full_name: '', email: '', department: '', hire_date: new Date().toISOString().split('T')[0] });
      fetchEmployees();
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to create employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      await deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      setError('Failed to delete employee');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress sx={{ color: '#e94560' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 300 }}>Employees</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ bgcolor: '#e94560', '&:hover': { bgcolor: '#d63050' } }}
        >
          Add Employee
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, bgcolor: '#16213e', color: '#fff' }}>
          {error}
        </Alert>
      )}

      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search employees by name, ID, email, or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            bgcolor: '#16213e',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': { borderColor: '#0f3460' },
              '&:hover fieldset': { borderColor: '#e94560' },
              '&.Mui-focused fieldset': { borderColor: '#e94560' },
            },
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#16213e' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Employee ID</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Full Name</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Department</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Hire Date</TableCell>
              <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography sx={{ color: '#94a3b8', py: 3 }}>
                    {searchQuery ? 'No employees match your search.' : 'No employees found. Add your first employee!'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id} sx={{ '&:hover': { bgcolor: '#0f3460' } }}>
                  <TableCell sx={{ color: '#fff' }}>{employee.employee_id}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{employee.full_name}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{employee.email}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{employee.department}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{employee.hire_date}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      sx={{ color: '#e94560', '&:hover': { color: '#ff6b6b' } }}
                      onClick={() => handleDelete(employee.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Employee Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#16213e' } }}>
        <DialogTitle sx={{ color: '#fff' }}>Add New Employee</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2, bgcolor: '#1a1a2e' }}>
              {formError}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Employee ID"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleInputChange}
              margin="normal"
              required
              sx={{ '& .MuiInputLabel-root': { color: '#94a3b8' }, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#0f3460' } } }}
            />
            <TextField
              fullWidth
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              margin="normal"
              required
              sx={{ '& .MuiInputLabel-root': { color: '#94a3b8' }, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#0f3460' } } }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
              sx={{ '& .MuiInputLabel-root': { color: '#94a3b8' }, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#0f3460' } } }}
            />
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              margin="normal"
              required
              sx={{ '& .MuiInputLabel-root': { color: '#94a3b8' }, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#0f3460' } } }}
            />
            <TextField
              fullWidth
              label="Hire Date"
              name="hire_date"
              type="date"
              value={formData.hire_date}
              onChange={handleInputChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiInputLabel-root': { color: '#94a3b8' }, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#0f3460' } } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{ bgcolor: '#e94560', '&:hover': { bgcolor: '#d63050' } }}
          >
            {submitting ? <CircularProgress size={24} /> : 'Add Employee'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Employees;
