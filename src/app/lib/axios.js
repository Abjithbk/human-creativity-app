import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Automatically attach the Authorization token to all requests
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                // Ensure we do not add quotes if they somehow got stored
                const cleanToken = token.replace(/^"(.*)"$/, '$1');
                config.headers.Authorization = `Bearer ${cleanToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
