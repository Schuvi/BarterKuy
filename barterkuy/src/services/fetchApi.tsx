import { api, apiWilayah } from "./axiosConfig";

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
    },
  });

  return response.data;
};

export const fetchDetail = async (kabupaten: string, id: number) => {
  const response = await api.get("/detail", {
    params: {
      lokasi: kabupaten,
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
      user_id: user_id
    }
  })

  return response.data
}