import axios from 'axios';

let accessToken = null;

const baseURL = import.meta.env.VITE_API_URL || 'https://gramzo.onrender.com/api';

export const setAccessToken = (token) => {
    accessToken = token;
};

const api = axios.create({
    baseURL: import.meta.env.DEV ? 'http://localhost:5000/api' : baseURL,
    withCredentials: true
});

// Request interceptor to add JWT
api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for auto-token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Avoid infinite loop if refresh token call itself fails
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
            originalRequest._retry = true;

            try {
                const res = await axios.post(
                    `${api.defaults.baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                if (res.data.success) {
                    accessToken = res.data.accessToken;
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, user needs to login again
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
