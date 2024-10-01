import { fetchLikedThings } from "@/hooks/fetchHooks";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { likeData } from "@/types/type";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IKImage } from "imagekitio-react";
import { DeleteLike } from "@/services/formPostHandler";
import { Button } from "@/components/ui/button";

function LikeBarang() {
  const user_id = useSelector((state: RootState) => state.user.user_id);

  const { data: likeThings } = fetchLikedThings(user_id);

  const deleteLikeBarang = DeleteLike(user_id)

  const handleDelete = (id: number, user_id: number) => {
    deleteLikeBarang.mutate({id, user_id})
  }

  return (
    <>
      <section className="p-3 mt-2 flex flex-col gap-y-3">
        {likeThings?.data?.map((item: likeData) => (
          <Card className="p-2 h-fit">
            <CardContent className="h-full">
              <div className="container h-full flex justify-center items-center">
                <div className="container w-[40vw] aspect-square mr-3 flex ">
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
                    path={typeof item.link_gambar === "object" ? item.link_gambar[0] : item.link_gambar}
                    transformation={[{ quality: "10" }]}
                    alt={`Ini gambar ${item.nama_barang}`}
                    className="object-cover"
                  />
                </div>
                <div className="container">
                  <h1>{item.nama_barang}</h1>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button className="bg-red-700" onClick={() => handleDelete(item.id, user_id)}>
                    hapus
                </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </>
  );
}

export default LikeBarang;
