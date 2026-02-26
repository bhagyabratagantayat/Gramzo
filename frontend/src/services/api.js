import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Request interceptor to add role & agent headers
api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('gramzoUser');
    if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role) {
            config.headers['x-user-role'] = user.role;
        }
        // Use _id as the agent-id for ownership checks
        if (user.role === 'Agent' && user._id) {
            config.headers['x-agent-id'] = user._id;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
