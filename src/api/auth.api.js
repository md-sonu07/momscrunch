import axiosApi from "./axios";

export const signupUser = async (userData) => {
    const response = await axiosApi.post("/api/user/auth/signup/", userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await axiosApi.post("/api/user/auth/login/", userData);
    return response.data;
};

export const logoutUser = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axiosApi.post("/api/user/auth/logout/", {
        refresh: refreshToken || null  // Send null if no refresh token
    });
    return response.data;
};

export const resendOtp = async () => {
    const response = await axiosApi.post("/api/user/auth/send-otp/");
    return response.data;
};

export const verifyOtp = async (otpData) => {
    const response = await axiosApi.post("/api/user/auth/verify-otp/", otpData);
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await axiosApi.post("/api/user/auth/forgot-password/", { email });
    return response.data;
};

export const resetPassword = async (resetData) => {
    const response = await axiosApi.post("/api/user/auth/reset-password/", resetData);
    return response.data;
};
