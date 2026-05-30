import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Response interceptor for error handling
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const getAllUsers   = ()           => http.get('/users');
export const getUserById   = (id)         => http.get(`/users/${id}`);

export const createUser    = (formData)   =>
  http.post('/users', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateUser    = (id, formData) =>
  http.put(`/users/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const deleteUser    = (id)         => http.delete(`/users/${id}`);
