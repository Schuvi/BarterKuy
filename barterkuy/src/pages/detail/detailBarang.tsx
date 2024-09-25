import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchDetailBarang } from "@/hooks/fetchHooks";
import { IKImage } from "imagekitio-react";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import blankProfile from "../../assets/blank_profile.png";
import { Button } from "@/components/ui/button";
import LaporPengguna from "@/components/modal/laporkanPengguna";
import like from "../../assets/hearts_500px.png";
import share from "../../assets/share_500px.png";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

interface detailData {
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

function DetailBarang() {
  const id = useSelector((state: RootState) => state.user.id_barang);
  const location = useSelector((state: RootState) => state.user.kabupaten);
  const [api, setApi] = useState<CarouselApi>();
  // const [current, setCurrent] = useState(0)
  // const [count, setCount] = useState(0)

  const { data: detail } = fetchDetailBarang(location, id);

  const gambar = detail?.data[0].link_gambar || [];

  const [index, setIndex] = useState(0);
  const [gambarTampil, setGambarTampil] = useState(gambar[0] || "");
  const [showLaporan, setShowLaporan] = useState<boolean>(false);

  useEffect(() => {
    if (gambar.length > 0) {
      setGambarTampil(gambar[index]);
    }
  }, [index, gambar]);

  const handleGambar = (i: number) => {
    setIndex(i);
  };

  return (
    <>
      <section className="flex flex-col min-h-screen">
        <div className="container w-full h-[30vh] bg-black bg-opacity-10 backdrop-blur-xl p-2">
          {/* {gambarTampil && (
            <IKImage
              urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
              path={gambarTampil}
              transformation={[
                {
                  quality: "10",
                },
              ]}
              alt="Selected Image"
              className="w-full h-full object-contain"
            />
          )} */}

          <Carousel setApi={setApi}>
            <CarouselContent>
              {gambar.map((gambar, index) => (
                <CarouselItem key={index}>
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
                    path={gambar} // panggil gambar dari array
                    transformation={[{ quality: "10" }]}
                    alt={`Image ${index + 1}`} // Alt text sesuai gambar
                    className="w-full h-full object-contain"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="container flex justify-center gap-3 mt-3">
          {gambar.map((item: string, index: number) => (
            <div key={index} className="w-[10vw]" onClick={() => handleGambar(index)}>
              <IKImage
                urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
                path={item}
                transformation={[
                  {
                    quality: "10",
                  },
                ]}
              />
            </div>
          ))}
        </div>

        {detail?.data.map((item: detailData) => (
          <div key={item.id} className="mt-3">
            <div className="container p-2 flex flex-col justify-between h-[12vh]">
              <h1 className="font-bold text-2xl">{item.nama_barang}</h1>
              <h1 className="text-lg text-color2">{item.jenis_penawaran}</h1>
            </div>

            <hr />

            <div className="container mt-1 p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-md font-bold">Deskripsi Barang</AccordionTrigger>
                  <AccordionContent className="whitespace-pre-line">{item.deskripsi_barang}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <h1 className="mt-3 font-bold text-md">Informasi Pemilik</h1>
            <div className="container flex mt-3 mb-16 p-2">
              <img src={item.gambar_profile === null ? blankProfile : item.gambar_profile} alt={item.nama_lengkap} className="w-[20vw] rounded-full" />
              <div className="container w-full flex flex-col justify-evenly ml-3">
                <p className="text-md font-bold">{item.nama_lengkap}</p>
                <p>
                  {item.kota}, {item.kecamatan}
                </p>
              </div>
              <div className="container w-fit flex items-center">
                <Button className="bg-red-600 rounded-full" onClick={() => setShowLaporan(!showLaporan)}>
                  !
                </Button>
              </div>
              {showLaporan && <LaporPengguna onClose={() => setShowLaporan(!showLaporan)} id={item.user_id} />}
            </div>
          </div>
        ))}

        <div className="fixed bottom-0 right-0 left-0 flex justify-between items-center h-[8vh] bg-color2 mt-auto p-2">
          <div className="container w-12">
            <img src={like} alt="logo like" className="h-full w-full" />
          </div>

          <div className="w-[50vw]">
            <Button className="w-full bg-color4 font-bold">Hubungi Pemilik</Button>
          </div>

          <div className="container w-9">
            <img src={share} alt="logo like" className="h-full w-full" />
          </div>
        </div>
      </section>
    </>
  );
}

export default DetailBarang;
