import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Read the current session for every request, including immediately after login.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  else config.headers.delete("Authorization");
  return config;
});

export const useApiRequest = <T = any>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (config: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.request<T>(config);
      setData(response.data);
      console.log("API Response:", response.data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<any>;
      const message =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Something went wrong";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
  }, []);

  return { request, data, loading, error, clearData };
};
