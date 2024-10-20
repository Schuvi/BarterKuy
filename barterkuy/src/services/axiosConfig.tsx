import axios from "axios";
import { useSelector } from "react-redux";
import { RootStatePersist } from "@/redux/redux-persist/store-persist";

const token = useSelector((state: RootStatePersist) => state.user.token)

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
    "Authorization" : `Bearer ${token}`
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
