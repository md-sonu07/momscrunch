import axiosApi from "./axios";

export const signupUser = async (userData) => {
    const response = await axiosApi.post("/api/user/auth/verify-otp/", userData);
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

export const sendOtp = async (registrationData) => {
    const response = await axiosApi.post("/api/user/auth/signup/", registrationData);
    return response.data;
};

export const verifyOtp = async (otpData) => {
    const response = await axiosApi.post("/api/user/auth/verify-otp/", otpData);
    return response.data;
};
