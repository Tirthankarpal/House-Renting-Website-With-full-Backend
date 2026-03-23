import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3002', // Express server port
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
