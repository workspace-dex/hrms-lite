import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Autocomplete,
  InputAdornment,
  Chip,
  Avatar,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { getEmployees, createAttendance, getAttendanceByEmployee } from '../services/api';

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('Present');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      setError('Please select an employee');
      return;
    }
    
    setError(null);
    setSubmitting(true);

    try {
      await createAttendance({
        employee_id: selectedEmployee.id,
        date: selectedDate,
        status: status,
      });
      
      if (viewingEmployee && viewingEmployee.id === selectedEmployee.id) {
        fetchAttendanceRecords(selectedEmployee.id);
      }
      
      setError(null);
      alert('Attendance marked successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchAttendanceRecords = async (employeeId) => {
    try {
      const response = await getAttendanceByEmployee(employeeId);
      setAttendanceRecords(response.data);
      const employee = employees.find(e => e.id === employeeId);
      setViewingEmployee(employee);
    } catch (err) {
      setError('Failed to load attendance records');
    }
  };

  const handleViewAttendance = (employeeId) => {
    fetchAttendanceRecords(employeeId);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress sx={{ color: '#e94560' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 300 }}>
        Attendance Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, bgcolor: '#16213e', color: '#fff' }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4, bgcolor: '#16213e', borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 3 }}>
            Mark Attendance
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Autocomplete
              options={employees}
              getOptionLabel={(option) => `${option.full_name} (${option.employee_id}) - ${option.department}`}
              value={selectedEmployee}
              onChange={(event, newValue) => {
                setSelectedEmployee(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search and Select Employee"
                  required
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#94a3b8' }} />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    '& .MuiInputLabel-root': { color: '#94a3b8' },
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: '#0f3460' },
                      '&:hover fieldset': { borderColor: '#e94560' },
                    },
                  }}
                />
              )}
              sx={{ mb: 2 }}
              PaperComponent={({ children }) => (
                <Paper sx={{ bgcolor: '#1a1a2e', color: '#fff' }}>{children}</Paper>
              )}
            />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mt: 2 }}>
              <TextField
                label="Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                sx={{
                  minWidth: 200,
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: '#0f3460' },
                  },
                }}
              />

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel sx={{ color: '#94a3b8' }}>Status</InputLabel>
                <Select
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#0f3460' },
                  }}
                >
                  <MenuItem value="Present">
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircleIcon sx={{ color: '#0ea5e9', fontSize: 20 }} />
                      Present
                    </Box>
                  </MenuItem>
                  <MenuItem value="Absent">
                    <Box display="flex" alignItems="center" gap={1}>
                      <CancelIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                      Absent
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting || !selectedEmployee}
                sx={{ 
                  bgcolor: '#e94560', 
                  '&:hover': { bgcolor: '#d63050' },
                  '&.Mui-disabled': { bgcolor: '#333' }
                }}
              >
                {submitting ? <CircularProgress size={24} /> : 'Mark Attendance'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search employees..."
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
            },
          }}
        />
      </Box>

      <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 2 }}>
        Employees
      </Typography>

      <TableContainer component={Paper} sx={{ bgcolor: '#16213e', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Employee</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Department</TableCell>
              <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 600 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id} sx={{ '&:hover': { bgcolor: '#0f3460' } }}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: '#e94560', width: 40, height: 40 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: '#fff', fontWeight: 500 }}>{employee.full_name}</Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>{employee.employee_id}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={employee.department} 
                    size="small"
                    sx={{ bgcolor: '#0f3460', color: '#fff' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewAttendance(employee.id)}
                    sx={{ 
                      borderColor: '#0ea5e9', 
                      color: '#0ea5e9',
                      '&:hover': { borderColor: '#0ea5e9', bgcolor: 'rgba(14, 165, 233, 0.1)' }
                    }}
                  >
                    View Attendance
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {viewingEmployee && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
            Attendance Records for {viewingEmployee.full_name}
          </Typography>
          <TableContainer component={Paper} sx={{ bgcolor: '#16213e', borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <Typography sx={{ color: '#94a3b8', py: 2 }}>
                        No attendance records found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  attendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell sx={{ color: '#fff' }}>{record.date}</TableCell>
                      <TableCell>
                        {record.status === 'Present' ? (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Present"
                            size="small"
                            sx={{ bgcolor: 'rgba(14, 165, 233, 0.2)', color: '#0ea5e9', borderColor: '#0ea5e9' }}
                          />
                        ) : (
                          <Chip
                            icon={<CancelIcon />}
                            label="Absent"
                            size="small"
                            sx={{ bgcolor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderColor: '#f59e0b' }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}

export default Attendance;
