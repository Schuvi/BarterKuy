import { useNavigate } from "react-router-dom";
import locationImg from "../../assets/location_filled_500px.png";
import { usePosts } from "@/hooks/fetchHooks";
import { IKImage } from "imagekitio-react";
import LocationFilter from "@/components/modal/locationFilter";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import like from "../../assets/hearts_500px.png";
import { postsData } from "@/types/type";
import { Card } from "@/components/ui/card";

function HomePage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const location = useSelector((state: RootState) => state.user.kabupaten);
  const kategori = useSelector((state: RootState) => state.user.kategori);
  const { data: posts } = usePosts(location, kategori);

  const handleDetail = (id: number) => {
    navigate(`/detail/${id}`);
  };

  return (
    <>
      <section className="h-[7vh] flex flex-row justify-between p-2">
        <div className="container h-full flex">
          <h1>Pilihan hari ini</h1>
        </div>

        <div className="container h-full flex justify-end">
          <img src={locationImg} alt="location logo" className="w-[7vw] h-[3vh]" />
          <p onClick={() => setShowModal(!showModal)} className="underline decoration-solid text-color2">
            {location}
          </p>
        </div>
      </section>

      <section className="p-2">
        <div className="container p-2 flex justify-start gap-x-6 gap-y-3 flex-wrap">
          {posts?.data.map((item: postsData) => (
            <Card className="w-[42vw] p-3 rounded-xl h-[38vh]" key={item.id} onClick={() => handleDetail(item.id)}>
              <div className="container w-full h-[18vh]">
                <IKImage
                  urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
                  path={item.link_gambar[0]}
                  transformation={[
                    {
                      quality: "10",
                    },
                  ]}
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>

              <div className="container flex flex-col justify-end h-[16vh] mt-2">
                <div className="container flex flex-col h-full justify-start">
                  <h1 className="font-bold text-md mb-2">{item.nama_barang.length >= 15 ? `${item.nama_barang.slice(0, 15)}...` : item.nama_barang}</h1>

                  <p className="mb-2 text-sm overflow-hidden">{item.deskripsi_barang.length >= 50 ? `${item.deskripsi_barang.slice(0, 50)}...` : item.deskripsi_barang}</p>
                </div>

                <h2 className="text-end text-sm text-color1 ">{item.lokasi}</h2>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <div className="fixed left-2 bottom-4 right-0 w-[15vw] h-[7vh] p-1 rounded-full bg-color2" onClick={() => navigate("/liked")}>
        <img src={like} alt="like" className="w-full" />
      </div>

      {showModal && <LocationFilter onClose={() => setShowModal(!showModal)} />}
    </>
  );
}

export default HomePage;
