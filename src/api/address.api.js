import axiosApi from './axios.js';

export const getAddresses = async () => {
    const response = await axiosApi.get('/api/addresses');
    return response.data;
};

export const createAddress = async (addressData) => {
    const response = await axiosApi.post('/api/addresses', addressData);
    return response.data;
};

export const updateAddress = async (id, addressData) => {
    const response = await axiosApi.put(`/api/addresses/${id}`, addressData);
    return response.data;
};

export const deleteAddress = async (id) => {
    const response = await axiosApi.delete(`/api/addresses/${id}`);
    return response.data;
};

export const setDefaultAddress = async (id) => {
    const response = await axiosApi.put(`/api/addresses/${id}/default`);
    return response.data;
};
