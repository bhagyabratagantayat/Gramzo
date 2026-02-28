import api from './api';

const notificationService = {
    getNotifications: async (params) => {
        const response = await api.get('/notifications', { params });
        return response.data;
    },
    createNotification: async (data) => {
        const response = await api.post('/notifications/create', data);
        return response.data;
    },
    deleteNotification: async (id, role) => {
        const response = await api.delete(`/notifications/${id}`, { data: { role } });
        return response.data;
    }
};

export default notificationService;
