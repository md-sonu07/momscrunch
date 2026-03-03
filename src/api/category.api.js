import axiosApi from './axios.js';

export const fetchCategories = async () => {
    const response = await axiosApi.get('/api/categories');
    return response.data;
};

export const fetchSubCategories = async (categoryId) => {
    const response = await axiosApi.get(`/api/subcategories/category/${categoryId}`);
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await axiosApi.post('/api/categories', categoryData);
    return response.data;
};

export const updateCategory = async (id, categoryData) => {
    const response = await axiosApi.put(`/api/categories/${id}`, categoryData);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await axiosApi.delete(`/api/categories/${id}`);
    return response.data;
};
