import axiosApi from './axios.js';

export const fetchCategories = async () => {
    const response = await axiosApi.get('/api/category/');
    return response.data;
};

export const fetchSubCategories = async (categoryId) => {
    // Note: The Swagger shows /api/subcategory/ for the list. 
    // If we need filtered by category, we might need to check if there's a filter param.
    // However, the Swagger path list doesn't show a specific category-filtered subcategory endpoint other than the list.
    const response = await axiosApi.get('/api/subcategory/');
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
