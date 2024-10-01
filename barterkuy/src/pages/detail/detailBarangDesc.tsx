import { detailData } from "@/types/type";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import LaporPengguna from "@/components/modal/laporkanPengguna";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import blankProfile from "../../assets/blank_profile.png";

function DetailBarangDesc({ detail }: { detail: detailData[] }) {
    const [showLaporan, setShowLaporan] = useState<boolean>(false);

    return (
        <>
            {detail?.map((item: detailData) => (
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
        </>
    )
}

export default DetailBarangDesc