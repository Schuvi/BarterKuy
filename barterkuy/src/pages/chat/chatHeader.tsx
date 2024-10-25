import { IKImage } from "imagekitio-react";
import { Button } from "@/components/ui/button";
import { receiveThingsHandler } from "@/services/formPostHandler";

function ChatHeader({ nama, gambarProfile, namaBarang, gambarBarang, receiver_id, giver_id, barang_id }: { nama: string; gambarProfile: string; namaBarang: string; gambarBarang: string, receiver_id: string, giver_id: string, barang_id: string}) {

  return (
    <>
      <section className="mb-3">
        <div className="container flex items-center gap-3 mb-3">
          <div className="container w-[18vw] rounded-full">
            <IKImage urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT} path={gambarProfile === null ? "/user/blank_profile.png" : gambarProfile} className="object-cover rounded-full" />
          </div>
          <h1>{nama}</h1>
        </div>
        <hr />
        <div className={`container flex items-center ${barang_id === giver_id? "hidden" : ""}`}>
          <div className="container flex items-center gap-3 mt-2 mb-3">
              <IKImage 
                  urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
                  path={gambarBarang}
                  className="object-cover rounded-md w-[12vw] h-[12vw]"
              />

              <h1>{namaBarang}</h1>
          </div>

          <div className="container text-end">
            <Button type="button" className="bg-color2" onClick={() => receiveThingsHandler(giver_id, receiver_id, barang_id)}>
              Setujui Negosiasi
            </Button>
          </div>
        </div>
        <hr />
      </section>
    </>
  );
}

export default ChatHeader;
