import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000', // Backend URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Retrieve JWT from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
