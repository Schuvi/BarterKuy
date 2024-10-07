import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchSearchThings } from "@/hooks/fetchHooks";
import { detailData } from "@/types/type";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { IKImage } from "imagekitio-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function SearchResult() {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const nama_barang = searchParams.get("nama_barang");

  const lokasiSearch = searchParams.get("lokasi");
  const triggerSearch = useSelector((state: RootState) => state.things.triggerSearch);

  const { data: searchValue, isError: error, isLoading: loading } = fetchSearchThings(nama_barang as string, triggerSearch as boolean, lokasiSearch as string);

  if (error) {
    alert("Gagal mengambil data");
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleToDetail = (id: number) => {
    navigate(`/detail/${id}`);
  };

  return (
    <>
      <div className="container p-2">
        {searchValue?.data.map((item: detailData) => (
          <Card key={item.id}>
            <CardContent className="p-2 flex items-center gap-3">
              <div className="container w-[30vw]">
                <IKImage
                  urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
                  path={item.link_gambar[0]}
                  transformation={[
                    {
                      quality: "10",
                    },
                  ]}
                  className="w-full rounded-md"
                />
              </div>

              <div className="container w-[50vw] flex flex-col gap-3">
                <h1 className="font-bold text-lg">{item.nama_barang}</h1>
                <div className="container">
                  <p className="whitespace-pre-line">{item.deskripsi_barang.length >= 40 ? `${item.deskripsi_barang.slice(0, 40)}...` : item.deskripsi_barang}</p>
                </div>
                <Button type="button" onClick={() => handleToDetail(item.id)} className="bg-color2">
                  Detail
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

export default SearchResult;
