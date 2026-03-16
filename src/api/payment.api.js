import axiosApi from './axios.js';

/**
 * Creates an order in the backend from the current cart.
 * @returns {Promise<Object>} - The created order details.
 */
export const placeOrder = async (shippingAddress) => {
    const response = await axiosApi.post('/api/user/checkout/place-order/', { shipping_address: shippingAddress });
    return response.data;
};

/**
 * Creates a Razorpay order in the backend.
 * @param {number|string} orderId - The existing order ID to create a payment for.
 * @returns {Promise<Object>} - The Razorpay order details.
 */
export const createPaymentOrder = async (orderId) => {
    const response = await axiosApi.post('/api/user/checkout/create-payment/', { order_id: orderId });
    return response.data;
};

/**
 * Verifies the Razorpay payment in the backend.
 * @param {Object} paymentData - The payment details from Razorpay (payment_id, order_id, signature).
 * @returns {Promise<Object>} - Success or failure message.
 */
export const verifyPayment = async (paymentData) => {
    const response = await axiosApi.post('/api/user/checkout/verify-payment/', paymentData);
    return response.data;
};

/**
 * Fetches the user's wallet balance and transactions.
 * @returns {Promise<Object>} - The wallet data.
 */
export const getWallet = async () => {
    const response = await axiosApi.get('/api/user/wallet/');
    return response.data;
};
