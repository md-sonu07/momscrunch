import axiosApi from './axios.js';

export const getOrders = async () => {
    const response = await axiosApi.get('/api/user/orders/');
    return response.data;
};

export const getOrderDetails = async (orderId) => {
    const response = await axiosApi.get(`/api/user/orders/${orderId}/`);
    return response.data;
};

export const cancelOrder = async (orderId) => {
    const response = await axiosApi.post(`/api/user/orders/${orderId}/cancel/`);
    return response.data;
};
