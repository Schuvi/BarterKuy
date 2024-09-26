import { fetchLikedThings } from "@/hooks/fetchHooks"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { likeData } from "@/types/type"
import {
    Card,
    CardContent
  } from "@/components/ui/card"
import { IKImage } from "imagekitio-react"

function LikeBarang() {
    const user_id = useSelector((state: RootState) => state.user.user_id)

    const {data: likeThings} = fetchLikedThings(user_id)

    return (
        <>
            <section className="p-3 mt-2">
                {likeThings?.data?.map((item: likeData) => (
                    <Card className="p-2 h-[20vh]">
                        <CardContent className="h-full">
                            <div className="container h-full flex justify-center items-center bg-slate-600">
                                <div className="container w-[40vw] bg-red-500 aspect-square mr-3">
                                    <IKImage
                                        urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
                                        path={item.link_gambar.length > 1 ? item.link_gambar[0] : item.link_gambar}
                                        transformation={[{ quality: "10" }]}
                                        alt={`Ini gambar ${item.nama_barang}`}
                                        className="object-fill"
                                    />
                                </div>
                                <div className="container">
                                    <h1>{item.nama_barang}</h1>
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </>
    )
}

export default LikeBarang