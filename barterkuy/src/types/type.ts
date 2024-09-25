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
