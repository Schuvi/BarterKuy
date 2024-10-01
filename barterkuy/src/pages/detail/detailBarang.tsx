import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchDetailBarang } from "@/hooks/fetchHooks";
import DetailBarangImg from "./detailBarangImg";
import DetailBarangDesc from "./detailBarangDesc";
import DetailBarangFoot from "./detailBarangFoot";
import { fetchLikedThings } from "@/hooks/fetchHooks";

function DetailBarang() {
  const id = useSelector((state: RootState) => state.user.id_barang);
  const user_id = useSelector((state: RootState) => state.user.user_id);

  const { data: detail } = fetchDetailBarang(id);

  const gambar = detail?.data[0].link_gambar || [];

  const data = detail?.data

  const { data: likedThings } = fetchLikedThings(user_id)

  const dataLiked = likedThings?.data

  return (
    <>
      <section className="flex flex-col min-h-screen">
        <DetailBarangImg gambar={gambar}/>

        <DetailBarangDesc detail={data} />

        <DetailBarangFoot like={dataLiked}/>
      </section>
    </>
  );
}

export default DetailBarang;
