import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "http://172.31.112.248:3000",
  // baseURL: "http://192.168.158.248:8000",
  // baseURL: "http://192.168.29.230:8000",
  baseURL: "http://10.41.94.249:8000",
  // baseURL: "https://api.schoolycore.com",
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
      const branchId = localStorage.getItem("branchId");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // if (branchId) {
      //   config.headers["X-Branch-Id"] = branchId;
      // }

      // attach language parameter so backend can return localized data
      config.params = { ...config.params, lang, ...(branchId ? { branchId } : {}) };

      // For non-GET methods, ensure branchId is in payload if applicable
      if (branchId && config.method && ["post", "put", "patch"].includes(config.method)) {
        if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
          config.data = { ...config.data, branchId };
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
