import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "http://172.31.112.248:3000",
  // baseURL: "http://192.168.1.23:8000",
  baseURL: "https://api.schoolycore.com",
  // baseURL: "http://dezoryn-school.ap-south-1.elasticbeanstalk.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const lang = localStorage.getItem("lang") || "en";

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // attach language parameter so backend can return localized data
      if (config.params) {
        config.params = { ...config.params, lang };
      } else {
        config.params = { lang };
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
