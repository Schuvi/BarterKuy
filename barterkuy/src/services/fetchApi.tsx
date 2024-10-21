import { api, apiWilayah } from "./axiosConfig";
import { useSelector } from "react-redux";
import { RootStatePersist } from "@/redux/redux-persist/store-persist";

export const fetchPosts = async (location: string, kategori?: string) => {
  const response = await api.get("/posts", { 
    params: {
      lokasi: location,
      kategori: kategori,
    },
  });

  return response.data;
};

export const fetchKab = async (provinsi: string) => {
  const response = await api.get("/kabupaten", {
    params: {
      prov: provinsi,
    }
  });

  return response.data;
};

export const fetchDetail = async (id: string) => {
  const response = await api.get("/detail", {
    params: {
      id: id,
    },
  });

  return response.data;
};

export const fetchProvinsi = async () => {
  const response = await apiWilayah.get("/provinsi/get");

  return response.data.result;
};

export const fetchKota = async (provId: string) => {
  const response = await apiWilayah.get(`/kabkota/get/`, {
    params: {
      d_provinsi_id: provId,
    },
  });

  return response.data.result;
};

export const fetchKecamatan = async (kotId: string) => {
  const response = await apiWilayah.get("/kecamatan/get/", {
    params: {
      d_kabkota_id: kotId,
    },
  });

  return response.data.result;
};

export const fetchLiked = async (user_id: number) => {
  const response = await api.get("/get/liked", {
    params: {
      user_id: user_id,
    },
  });

  return response.data;
};

export const fetchSearch = async (nama_barang: string, lokasi?: string) => {
  const response = await api.get("/search", {
    params: {
      nama_barang: `%${nama_barang}%`,
      lokasi: lokasi,
    },
  });

  return response.data;
};

export const fetchKategori = async () => {
  const response = await api.get("/get/kategori");

  return response.data;
};

export const fetchProfile = async (user_id: string) => {
  const response = await api.get("/get/user", {
    params: {
      user_id: user_id,
    }
  });

  return response.data;
};
