import GiveThingsUpImg from "./pengajuanUploadImg";
import GiveThingsForm from "./pengajuanForm";
import { fetchAllKategori } from "@/hooks/fetchHooks";

function GiveThings() {
    const {data: kategori, isLoading: loadingKategori, isError: errorKategori} = fetchAllKategori()

  return (
    <>
      <h1>Pengajuan Barang</h1>
      <GiveThingsForm kategori={kategori?.data} loadingData={loadingKategori} errorData={errorKategori}/>
      <GiveThingsUpImg />
    </>
  );
}

export default GiveThings;
