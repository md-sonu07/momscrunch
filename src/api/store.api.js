import axiosApi from './axios.js';

// Store Settings API
export const storeSettingsAPI = {
    // Get store settings including GST and delivery charges
    getStoreSettings: async () => {
        const response = await axiosApi.get('/api/shop/store-settings/');
        return response.data;
    },
    // Get full store profile (branding, social, SEO)
    getStoreProfile: async () => {
        const response = await axiosApi.get('/api/shop/profile/');
        return response.data;
    },
};

export default storeSettingsAPI;
