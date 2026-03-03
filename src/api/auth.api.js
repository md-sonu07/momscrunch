import axiosApi from "./axios";

export const signupUser = async (userData) => {
    const response = await axiosApi.post("/api/auth/signup", userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await axiosApi.post("/api/auth/login", userData);
    return response.data;
};

export const logoutUser = async () => {
    const response = await axiosApi.get("/api/auth/logout");
    return response.data;
};

export const sendOtp = async (email) => {
    const response = await axiosApi.post("/api/auth/send-otp", { email });
    return response.data;
};

export const verifyOtp = async (otpData) => {
    const response = await axiosApi.post("/api/auth/verify-otp", otpData);
    return response.data;
};
