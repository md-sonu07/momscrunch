import axiosApi from './axios';

export const fetchReviews = async (params) => {
    const response = await axiosApi.get('/api/shop/reviews/', { params });
    return response.data;
};

export const createReview = async (reviewData) => {
    const response = await axiosApi.post('/api/shop/reviews/', reviewData);
    return response.data;
};

export const deleteReview = async (reviewId) => {
    await axiosApi.delete(`/api/shop/reviews/${reviewId}/`);
};
