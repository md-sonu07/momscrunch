import axiosApi from './axios.js';

// Category APIs
export const fetchCategories = async () => {
    const response = await axiosApi.get('/api/shop/categories/');
    return response.data;
};

export const fetchCategoryDetail = async (id) => {
    const response = await axiosApi.get(`/api/shop/categories/${id}/`);
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await axiosApi.post('/api/admin/categories/', categoryData);
    return response.data;
};

export const updateCategory = async (id, categoryData) => {
    const response = await axiosApi.put(`/api/admin/categories/${id}/`, categoryData);
    return response.data;
};

export const patchCategory = async (id, categoryData) => {
    const response = await axiosApi.patch(`/api/admin/categories/${id}/`, categoryData);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await axiosApi.delete(`/api/admin/categories/${id}/`);
    return response.data;
};

// Subcategory APIs
export const fetchSubCategories = async () => {
    const response = await axiosApi.get('/api/shop/subcategories/');
    return response.data;
};

export const fetchSubCategoryDetail = async (id) => {
    const response = await axiosApi.get(`/api/shop/subcategories/${id}/`);
    return response.data;
};

export const createSubCategory = async (subCategoryData) => {
    const response = await axiosApi.post('/api/admin/subcategories/', subCategoryData);
    return response.data;
};

export const updateSubCategory = async (id, subCategoryData) => {
    const response = await axiosApi.put(`/api/admin/subcategories/${id}/`, subCategoryData);
    return response.data;
};

export const deleteSubCategory = async (id) => {
    const response = await axiosApi.delete(`/api/admin/subcategories/${id}/`);
    return response.data;
};

