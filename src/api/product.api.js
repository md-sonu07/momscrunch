import axiosApi from './axios.js';

export const fetchProducts = async (params) => {
    const response = await axiosApi.get('/api/product/', { params });
    return response.data;
};

export const fetchProductById = async (id) => {
    const response = await axiosApi.get(`/api/product/${id}/`);
    return response.data;
};

export const createProduct = async (productData) => {
    const response = await axiosApi.post('/api/product/', productData);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await axiosApi.put(`/api/product/${id}/`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await axiosApi.delete(`/api/product/${id}/`);
    return response.data;
};
