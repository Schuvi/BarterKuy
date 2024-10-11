import GiveThingsForm from "./pengajuanForm";
import { fetchAllKategori } from "@/hooks/fetchHooks";

function GiveThings() {
    const {data: kategori, isLoading: loadingKategori, isError: errorKategori} = fetchAllKategori()

  return (
    <>
      <section className="p-2">
        <h1 className="text-xl font-bold mb-2">Ajukan Barang</h1>
        <p className="text-sm font-light">Silahkan isi form dibawah ini untuk mengajukan barang</p>
      </section>

      <GiveThingsForm kategori={kategori?.data} loadingData={loadingKategori} errorData={errorKategori}/>
    </>
  );
}

export default GiveThings;
