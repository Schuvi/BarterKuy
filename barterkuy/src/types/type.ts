export interface detailData {
  id: number;
  nama_barang: string;
  deskripsi_barang: string;
  lokasi: string;
  jenis_penawaran: string;
  status_pengajuan: string;
  status_barter: string | null;
  kategori: string;
  nama_lengkap: string;
  link_gambar: string;
  gambar_profile: string | null;
  kota: string;
  kecamatan: string;
  user_id: number;
}

export interface likeData {
  id: number;
  user_id: number;
  nama_barang: string;
  link_gambar: string;
}

export interface LoginGoogle {
  email?: string;
  name?: string;
  picture?: string;
}

export interface postsData {
  id: number;
  nama_barang: string;
  deskripsi_barang: string;
  lokasi: string;
  jenis_penawaran: string;
  status_pengajuan: string;
  status_barter: string | null;
  kategori: string;
  nama_lengkap: string;
  link_gambar: string;
}

export interface detailGambar {
  gambar: string[];
}

export interface dataKategori {
  kategori_id: number;
  kategori: string;
}

export interface dataImgProfile {
  gambar_profile: string | null;
  user_id: string | undefined;
  gambar_id: string;
  isLoading: boolean;
}

export interface dataProfile extends dataImgProfile {
  email: string;
  nama_lengkap: string;
  nomor_telepon: string;
  role: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
}

export type editState = {
  nama: boolean;
  telephone: boolean;
  location: boolean;
};

export type stateKota = {
  provId: string;
  trigger: boolean;
  kotName: string;
};

export type stateKec = {
  kotId: string;
  trigger: boolean;
  kecName: string;
};

export type stateProv = {
  provName: string;
}
