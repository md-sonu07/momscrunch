import axiosApi from "./axios";

export const getUserProfile = async () => {
    // Generally, if PUT is at /customer/profile/, GET might be there too
    const response = await axiosApi.get("/customer/profile/");
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await axiosApi.put("/customer/profile/", profileData);
    return response.data;
};

export const changePassword = async (passwordData) => {
    const response = await axiosApi.put("/api/auth/updatepassword", passwordData);
    return response.data;
};

export const fetchAllUsers = async () => {
    const response = await axiosApi.get("/api/users");
    return response.data;
};

export const fetchUserById = async (id) => {
    const response = await axiosApi.get(`/api/users/${id}`);
    return response.data;
};

export const manageUserUpdate = async (id, userData) => {
    const response = await axiosApi.put(`/api/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axiosApi.delete(`/api/users/${id}`);
    return response.data;
};