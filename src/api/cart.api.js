import axiosApi from './axios.js';

const normalizeCartResponse = (data) => {
    if (Array.isArray(data)) {
        return data[0] ?? null;
    }

    return data ?? null;
};

export const getCart = async () => {
    const response = await axiosApi.get('/api/user/cart/');
    return normalizeCartResponse(response.data);
};

export const addToCart = async (variantId, quantity = 1) => {
    const response = await axiosApi.post('/api/user/cart-items/add/', {
        product_variant: variantId,
        quantity,
    });
    return normalizeCartResponse(response.data);
};

export const removeFromCart = async (variantId) => {
    const response = await axiosApi.post('/api/user/cart-items/remove/', {
        product_variant: variantId,
    });
    return normalizeCartResponse(response.data);
};

export const updateCartItem = async (itemId, quantity) => {
    const response = await axiosApi.patch(`/api/user/cart-items/${itemId}/`, { quantity });
    return response.data;
};

export const deleteCartItem = async (itemId) => {
    const response = await axiosApi.delete(`/api/user/cart-items/${itemId}/`);
    return response.data;
};

export const clearCart = async () => {
    const cart = await getCart();

    if (!cart?.items?.length) {
        return cart;
    }

    await Promise.all(cart.items.map((item) => deleteCartItem(item.id)));
    return getCart();
};
