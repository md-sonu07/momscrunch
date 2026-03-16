import axiosApi from './axios.js';

export const getWishlist = async () => {
    const response = await axiosApi.get('/api/user/wishlist-items/');
    return Array.isArray(response.data) ? response.data : [];
};

export const addWishlistItem = async (variantId) => {
    const response = await axiosApi.post('/api/user/wishlist-items/add/', {
        product_variant: variantId,
    });
    return response.data;
};

export const removeWishlistItem = async (variantId) => {
    await axiosApi.post('/api/user/wishlist-items/remove/', {
        product_variant: variantId,
    });
    return getWishlist();
};

export const deleteWishlistItem = async (itemId) => {
    await axiosApi.delete(`/api/user/wishlist-items/${itemId}/`);
    return getWishlist();
};

export const clearWishlist = async () => {
    await axiosApi.delete('/api/user/wishlist-items/clear/');
    return [];
};
