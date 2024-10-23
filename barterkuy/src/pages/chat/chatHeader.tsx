import { IKImage } from "imagekitio-react";

function ChatHeader({ nama, gambarProfile, namaBarang, gambarBarang }: { nama: string; gambarProfile: string; namaBarang: string; gambarBarang: string}) {
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
        <div className="container flex items-center gap-3 mt-2 mb-3">
            <IKImage 
                urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
                path={gambarBarang}
                className="object-cover rounded-md w-[12vw] h-[12vw]"
            />

            <h1>{namaBarang}</h1>
        </div>
        <hr />
      </section>
    </>
  );
}

export default ChatHeader;
