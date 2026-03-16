import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "";
// console.log("Axios Base URL (Proxy Mode):", baseURL === "" ? "Relative (Vite Proxy)" : baseURL);

const axiosApi = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Request Interceptor to add Auth Token
axiosApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor for Error Handling
axiosApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Session expired or unauthorized. Logging out...");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = '/login';
        }
        const message = error.response?.data?.error || error.response?.data?.message || error.message;
        console.error("Api Error: ", message);
        return Promise.reject(error);
    }
);

export default axiosApi;
