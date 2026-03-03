import axiosApi from './axios.js';

export const fetchProducts = async (params) => {
    const response = await axiosApi.get('/api/products', { params });
    return response.data;
};

export const fetchProductById = async (id) => {
    const response = await axiosApi.get(`/api/products/${id}`);
    return response.data;
};

export const createProduct = async (productData) => {
    const response = await axiosApi.post('/api/products', productData);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await axiosApi.put(`/api/products/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await axiosApi.delete(`/api/products/${id}`);
    return response.data;
};
