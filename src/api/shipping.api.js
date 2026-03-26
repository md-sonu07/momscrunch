import axiosApi from './axios.js';

/**
 * Get shipping charges based on pincode (auto-detects delivery type).
*/
export const getShippingCharges = async (data) => {
    const response = await axiosApi.post('/api/user/checkout/shipping-charges/', data);
    return response.data;
};
