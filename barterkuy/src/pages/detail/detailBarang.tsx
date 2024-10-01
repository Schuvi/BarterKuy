import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchDetailBarang } from "@/hooks/fetchHooks";
import DetailBarangImg from "./detailBarangImg";
import DetailBarangDesc from "./detailBarangDesc";
import DetailBarangFoot from "./detailBarangFoot";

function DetailBarang() {
  const id = useSelector((state: RootState) => state.user.id_barang);
  const location = useSelector((state: RootState) => state.user.kabupaten);

  const { data: detail } = fetchDetailBarang(location, id);

  const gambar = detail?.data[0].link_gambar || [];

  const data = detail?.data

  return (
    <>
      <section className="flex flex-col min-h-screen">
        <DetailBarangImg gambar={gambar}/>

        <DetailBarangDesc detail={data} />

        <DetailBarangFoot/>
      </section>
    </>
  );
}

export default DetailBarang;
