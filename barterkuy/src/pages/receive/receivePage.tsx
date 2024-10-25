import { Card } from "@/components/ui/card"
import { useParams } from "react-router-dom"
import { fetchReceive } from "@/hooks/fetchHooks"
import { receiveThings } from "@/types/type"
import { IKImage } from "imagekitio-react"

function ReceiveThings() {
    const {user_id} = useParams()

    const {data: receiveData, isLoading: loadingData, isError: errorData} = fetchReceive(user_id as string)

    if (loadingData) {
        return <div>Loading...</div>
    }

    if (errorData) {
        return <div>Error</div>
    }

    return(
        <>
            <section className="mt-2 p-2">
                <h1 className="font-bold text-lg">Barang Diterima</h1>

                <div className="container mt-2">
                    {receiveData?.map((item: receiveThings) => (
                       <div className="container" key={item.nama_barang}>
                        <Card className="p-4 pt-2">
                            <h1><span className="font-bold">Barang dari :</span> {item.nama_lengkap}</h1>
                            
                            <div className="container flex gap-3 items-center h-fit">
                                <div className="container flex items-center w-[6rem] h-[5rem]">
                                    <IKImage
                                        urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
                                        path={item.link_gambar[0]}
                                        transformation={[{
                                            quality: "10"
                                        }]}
                                        className="w-full h-full object-cover mt-2 rounded-lg"
                                    />
                                </div>

                                <div className="container flex flex-col justify-around h-[5rem]">
                                    <h1 className="font-bold text-lg">{item.nama_barang}</h1>
                                    <h1>{item.tanggal}</h1>
                                    <h1>{item.lokasi}</h1>
                                </div>
                            </div>
                        </Card>
                       </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default ReceiveThings