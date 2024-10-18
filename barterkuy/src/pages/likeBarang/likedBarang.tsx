import { fetchLikedThings } from "@/hooks/fetchHooks";
import { useSelector, useDispatch } from "react-redux";
import { RootStatePersist } from "@/redux/redux-persist/store-persist";
import { likeData } from "@/types/type";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IKImage } from "imagekitio-react";
import { DeleteLike } from "@/services/formPostHandler";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { update } from "@/redux/userSlice";
import { Skeleton } from "@/components/ui/skeleton";

function LikeBarang() {
  const user_id = useSelector((state: RootStatePersist) => state.user.user_id);

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { data: likeThings, isError, isLoading } = fetchLikedThings(user_id);

  const deleteLikeBarang = DeleteLike(user_id)

  const handleDelete = (id: number, user_id: number) => {
    deleteLikeBarang.mutate({id, user_id})
  }

  const handleDetail = (id: number) => {
    dispatch(update({id_barang: id}))

    navigate(`/detail/${id}`)
  }

  if (isError) {
    return(
      <>
        <h1 className="text-center mt-5">Tidak ada barang dalam favorit</h1>
      </>
    )
  }

  if (isLoading) {
    return(
      <>
        <div className="container flex flex-row gap-x-1 p-5">
          <div className="container">
            <Skeleton className="aspect-square w-[25vw]"/>
          </div>
          <div className="container flex items-center">
            <Skeleton className="w-[60vw] h-[3vh]"/>
          </div>
        </div>
        <div className="container flex justify-between p-5">
          <Skeleton className="w-[20vw] h-[4vh]"/>
          <Skeleton className="w-[30vw] h-[4vh]"/>
        </div>
      </>
    )
  }

  return (
    <>
      <section className="p-3 mt-2 flex flex-col gap-y-3">
        {likeThings?.data?.map((item: likeData) => (
          <Card className="p-2 h-fit" key={item.id}>
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
            <CardFooter className="flex justify-between">
                <Button className="bg-red-700" onClick={() => handleDelete(item.id, user_id)}>
                    hapus
                </Button>
                <Button className="bg-color1" onClick={() => handleDetail(item.id)}>
                    Lihat Barang
                </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </>
  );
}

export default LikeBarang;
