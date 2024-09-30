import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:1337/api", // Thay đổi thành URL của API của bạn
  timeout: 10000, // Thời gian timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Middleware: xử lý request và response
axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token"); // Ví dụ: lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: any) => {
    if (error.response) {
      console.error("Error Response:", error.response);
    } else if (error.request) {
      console.error("Error Request:", error.request);
    } else {
      console.error("Error Message:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
