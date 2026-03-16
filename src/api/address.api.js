import axiosApi from './axios.js';

const normalizeAddressList = (data) => (Array.isArray(data) ? data : []);

export const getAddresses = async () => {
    const response = await axiosApi.get('/api/user/address/');
    return normalizeAddressList(response.data);
};

export const createAddress = async (addressData) => {
    await axiosApi.post('/api/user/address/', addressData);
    return getAddresses();
};

export const updateAddress = async (id, addressData) => {
    await axiosApi.patch(`/api/user/address/${id}/`, addressData);
    return getAddresses();
};

export const deleteAddress = async (id) => {
    await axiosApi.delete(`/api/user/address/${id}/`);
    return getAddresses();
};

export const setDefaultAddress = async (id) => {
    await axiosApi.patch(`/api/user/address/${id}/default/`);
    return getAddresses();
};
