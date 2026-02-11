import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee APIs
export const getEmployees = () => api.get('/employees/');
export const createEmployee = (data) => api.post('/employees/', data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// Attendance APIs
export const getAttendanceByEmployee = (employeeId) => api.get(`/attendance/employee/${employeeId}`);
export const createAttendance = (data) => api.post('/attendance/', data);
export const getAllAttendance = () => api.get('/attendance/');

// Dashboard API
export const getDashboardStats = () => api.get('/dashboard/stats');

export default api;
