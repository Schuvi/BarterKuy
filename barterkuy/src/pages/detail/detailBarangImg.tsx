import { IKImage } from "imagekitio-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { detailGambar } from "@/types/type";

function DetailBarangImg({ gambar }: detailGambar) {
    return(
        <>
            <div className="container flex justify-center items-center mt-3 h-[32vh]">
                <Carousel className="w-[70vw]">
                    <CarouselContent>
                        {gambar.map((gambar: string, index: number) => (
                            <CarouselItem key={index}>
                                <IKImage urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT} path={gambar} transformation={[{ quality: "10" }]} alt={`Image ${index + 1}`} className="w-full h-[32vh] object-contain overflow-hidden" />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </>
    )
}

export default DetailBarangImg