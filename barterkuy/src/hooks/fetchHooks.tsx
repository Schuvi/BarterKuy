import { useQuery } from "@tanstack/react-query";
import { fetchPosts, fetchKab, fetchDetail, fetchProvinsi, fetchKota, fetchKecamatan } from "@/services/fetchApi";

export const usePosts = (location: string, kategori?: string) => {
  return useQuery({
    queryKey: ["posts", location, kategori],
    queryFn: async ({ queryKey }) => fetchPosts(queryKey[1] as string, queryKey[2] as string),
    retry: 2,
    refetchInterval: 60000,
  });
};

export const fetchKabupaten = (provinsi: string) => {
  return useQuery({
    queryKey: ["kabupaten", provinsi],
    queryFn: async ({ queryKey }) => fetchKab(queryKey[1] as string),
    retry: 2,
    refetchInterval: false,
  });
};

export const fetchDetailBarang = (kabupaten: string, id: number) => {
  return useQuery({
    queryKey: ["detail", kabupaten, id],
    queryFn: async ({ queryKey }) => fetchDetail(queryKey[1] as string, queryKey[2] as number),
    retry: 2,
    refetchInterval: false,
  });
};

export const fetchProv = () => {
  return useQuery({
    queryKey: ["provinsi"],
    queryFn: fetchProvinsi,
    retry: 2,
    refetchInterval: false,
  });
};

export const fetchKot = (provId: string, trigger: boolean) => {
  return useQuery({
    queryKey: ["kota", provId],
    queryFn: async ({ queryKey }) => fetchKota(queryKey[1] as string),
    retry: 2,
    refetchInterval: false,
    enabled: trigger,
  });
};

export const fetchKec = (kotId: string, trigger: boolean) => {
  return useQuery({
    queryKey: ["kecamatan", kotId],
    queryFn: async ({ queryKey }) => fetchKecamatan(queryKey[1] as string),
    retry: 2,
    refetchInterval: false,
    enabled: trigger,
  });
};
