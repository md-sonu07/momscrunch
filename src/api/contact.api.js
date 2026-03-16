import axiosApi from './axios';

export const sendContactMessage = async (payload) => {
    const response = await axiosApi.post('/api/shop/contact-messages/', payload);
    return response.data;
};
