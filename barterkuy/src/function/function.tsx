import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const usePosts = (location: string, kategori?: string) => {
  const fetchPosts = async (location: string, kategori: string) => {
    const response = await axios.get(import.meta.env.VITE_API_ENDPOINT + `/posts`, {
      params: {
        lokasi: location,
        kategori: kategori,
      },
    });

    return response.data;
  };

  return useQuery({
    queryKey: ["posts", location, kategori],
    queryFn: async ({ queryKey }) => fetchPosts(queryKey[1] as string, queryKey[2] as string),
    retry: 2,
    refetchInterval: 60000,
  });
};

export const fetchKabupaten = (provinsi: string) => {
  const reqKab = async () => {
    const response = await axios.get(import.meta.env.VITE_API_ENDPOINT + "/kabupaten", {
      params: {
        prov: provinsi,
      },
    });

    return response.data;
  };

  return useQuery({
    queryKey: ["kabupaten"],
    queryFn: reqKab,
    retry: 2,
    refetchInterval: false,
  });
};
