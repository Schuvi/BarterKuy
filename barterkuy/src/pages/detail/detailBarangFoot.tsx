import { Button } from "@/components/ui/button";
import like from "../../assets/hearts_500px.png";
import share from "../../assets/share_500px.png";

function DetailBarangFoot() {
    return(
        <>
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
        </>
    )
}

export default DetailBarangFoot