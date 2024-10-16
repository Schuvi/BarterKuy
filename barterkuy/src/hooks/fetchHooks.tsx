import { useQuery } from "@tanstack/react-query";
import { fetchPosts, fetchKab, fetchDetail, fetchProvinsi, fetchKota, fetchKecamatan, fetchLiked, fetchSearch, fetchKategori, fetchProfile } from "@/services/fetchApi";

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

export const fetchDetailBarang = (id: string) => {
  return useQuery({
    queryKey: ["detail", id],
    queryFn: async ({ queryKey }) => fetchDetail(queryKey[1] as string),
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

export const fetchLikedThings = (user_id: number) => {
  return useQuery({
    queryKey: ["liked", user_id],
    queryFn: async ({ queryKey }) => fetchLiked(queryKey[1] as number),
    retry: 1,
    refetchInterval: false,
  });
};

export const fetchSearchThings = (nama_barang: string, trigger: boolean, lokasi?: string) => {
  return useQuery({
    queryKey: ["search", lokasi, nama_barang],
    queryFn: async ({ queryKey }) => fetchSearch(queryKey[2] as string, queryKey[1] as string),
    retry: 1,
    refetchInterval: false,
    enabled: trigger,
  });
};

export const fetchAllKategori = () => {
  return useQuery({
    queryKey: ["kategori"],
    queryFn: fetchKategori,
    retry: 1,
    refetchInterval: false,
  });
};

export const fetchProfileUser = (user_id : string) => {
  return useQuery({
    queryKey: ["profile", user_id],
    queryFn: async ({queryKey}) => fetchProfile(queryKey[1] as string),
    retry: 1,
    refetchInterval: false,
  })
}
