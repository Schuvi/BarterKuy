import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000
})

export const apiWilayah = axios.create({
    baseURL: "https://alamat.thecloudalert.com/api",
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000
})