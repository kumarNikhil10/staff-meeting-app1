import axios from 'axios';

const API = axios.create({ baseURL: 'https://staff-meeting-app1.onrender.com' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// AUTH
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// MEETINGS
export const getMeetings = () => API.get('/meetings');
export const getMeeting = (id) => API.get(`/meetings/${id}`);
export const createMeeting = (data) => API.post('/meetings', data);
export const updateMeetingStatus = (id, status) => API.put(`/meetings/${id}/status`, { status });
export const respondToMeeting = (id, status) => API.put(`/meetings/${id}/respond`, { status });
export const submitThroughput = (id, throughput) => API.put(`/meetings/${id}/throughput`, { throughput });
export const deleteMeeting = (id) => API.delete(`/meetings/${id}`);

// USERS
export const getUsers = () => API.get('/users');
export const getPendingHods = () => API.get('/users/pending-hods');
export const approveHod = (id) => API.put(`/users/${id}/approve`);
export const rejectHod = (id) => API.delete(`/users/${id}/reject`);
export const blacklistUser = (id, reason) => API.put(`/users/${id}/blacklist`, { reason });
export const unblacklistUser = (id) => API.put(`/users/${id}/unblacklist`);
export const deleteUser = (id) => API.delete(`/users/${id}`);
