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
        <CircularProgress sx={{ color: '#2563eb' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: '#1e293b', fontWeight: 600, letterSpacing: '0.3px' }}>
          Employees
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ 
            bgcolor: '#2563eb', 
            '&:hover': { bgcolor: '#1d4ed8' },
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
          }}
        >
          Add Employee
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
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
            bgcolor: '#ffffff',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              color: '#1e293b',
              '& fieldset': { borderColor: '#e2e8f0' },
              '&:hover fieldset': { borderColor: '#2563eb' },
              '&.Mui-focused fieldset': { borderColor: '#2563eb' },
            },
          }}
        />
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          bgcolor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell sx={{ color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>Employee ID</TableCell>
              <TableCell sx={{ color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>Full Name</TableCell>
              <TableCell sx={{ color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>Email</TableCell>
              <TableCell sx={{ color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>Department</TableCell>
              <TableCell sx={{ color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>Hire Date</TableCell>
              <TableCell align="right" sx={{ color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography sx={{ color: '#64748b', py: 4 }}>
                    {searchQuery ? 'No employees match your search.' : 'No employees found. Add your first employee!'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow 
                  key={employee.id} 
                  sx={{ 
                    '&:hover': { bgcolor: '#f8fafc' },
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell sx={{ color: '#1e293b', fontWeight: 500 }}>{employee.employee_id}</TableCell>
                  <TableCell sx={{ color: '#334155' }}>{employee.full_name}</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>{employee.email}</TableCell>
                  <TableCell sx={{ color: '#334155' }}>{employee.department}</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>{employee.hire_date}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      sx={{ color: '#ef4444', '&:hover': { color: '#dc2626', bgcolor: '#fef2f2' } }}
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

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: '#1e293b', fontWeight: 600, pb: 1 }}>
          Add New Employee
        </DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
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
              sx={{ '& .MuiInputLabel-root': { color: '#64748b' } }}
            />
            <TextField
              fullWidth
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              margin="normal"
              required
              sx={{ '& .MuiInputLabel-root': { color: '#64748b' } }}
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
              sx={{ '& .MuiInputLabel-root': { color: '#64748b' } }}
            />
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              margin="normal"
              required
              sx={{ '& .MuiInputLabel-root': { color: '#64748b' } }}
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
              sx={{ '& .MuiInputLabel-root': { color: '#64748b' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#64748b', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{ 
              bgcolor: '#2563eb', 
              '&:hover': { bgcolor: '#1d4ed8' },
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            {submitting ? <CircularProgress size={24} /> : 'Add Employee'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Employees;
