import axiosApi from './axios';

export const fetchOurStoryData = async () => {
    const response = await axiosApi.get('/api/shop/our-story/');
    return response.data;
};
