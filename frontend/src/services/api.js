import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://gramzo.onrender.com/api';

const api = axios.create({
    baseURL: import.meta.env.DEV ? 'http://localhost:5000/api' : baseURL,
    withCredentials: true
});

// Request interceptor for debugging or other headers if needed
api.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for error logging
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export default api;
