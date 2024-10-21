import axios from "axios";
import { persistedStore } from "../redux/redux-persist/store-persist.tsx";
import { signout } from "@/redux/userSlice.tsx";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export const apiWilayah = axios.create({
  baseURL: "https://alamat.thecloudalert.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    const token = persistedStore.getState().user.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      persistedStore.dispatch(signout());
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
