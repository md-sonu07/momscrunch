import axiosApi from './axios.js';

export const fetchProducts = async (params) => {
    const response = await axiosApi.get('/api/shop/products/', { params });
    return response.data;
};

export const fetchProductBySlug = async (slug) => {
    const response = await axiosApi.get(`/api/shop/products/${slug}/`);
    return response.data;
};

export const createProduct = async (productData) => {
    // Admin uses /api/admin/products/
    const response = await axiosApi.post('/api/admin/products/', productData);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await axiosApi.put(`/api/admin/products/${id}/`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await axiosApi.delete(`/api/admin/products/${id}/`);
    return response.data;
};

