import axiosApi from "./axios";

export const getUserProfile = async () => {
    const response = await axiosApi.get("/api/user/profile/");
    return response.data;
};

export const updateProfile = async (profileData) => {
    // Check if we have a file/blob - if so use FormData
    const hasFile = Object.values(profileData).some(value => value instanceof Blob || value instanceof File);

    if (hasFile) {
        const formData = new FormData();
        Object.keys(profileData).forEach(key => {
            if (profileData[key] !== undefined && profileData[key] !== null) {
                formData.append(key, profileData[key]);
            }
        });
        const response = await axiosApi.put("/api/user/profile/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    const response = await axiosApi.put("/api/user/profile/", profileData);
    return response.data;
};

export const changePassword = async (passwordData) => {
    const response = await axiosApi.post("/api/user/auth/change-password/", passwordData);
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