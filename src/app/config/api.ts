import axios from 'axios';
import { generateApiKey } from '@/app/_backend/_utils/generateApiKey';

// Create an instance of axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000, // Request timeout
  headers: {
    "Content-Type": "application/json",
  },
});

const { generateHash } = generateApiKey();

const token = generateHash(process.env.NEXT_PUBLIC_HOST || "");

// Request interceptor
api.interceptors.request.use(
  config => {
    // You can add custom headers here
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle errors
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error('Response error:', error.response);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Request error:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;