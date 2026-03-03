import axiosApi from './axios.js';

export const getCart = async () => {
    const response = await axiosApi.get('/api/cart');
    return response.data;
};

export const addToCart = async (cartData) => {
    const response = await axiosApi.post('/api/cart', cartData);
    return response.data;
};

export const updateCartItem = async (productId, quantity) => {
    const response = await axiosApi.put(`/api/cart/${productId}`, { quantity });
    return response.data;
};

export const removeFromCart = async (productId) => {
    const response = await axiosApi.delete(`/api/cart/${productId}`);
    return response.data;
};

export const clearCart = async () => {
    const response = await axiosApi.delete('/api/cart');
    return response.data;
};