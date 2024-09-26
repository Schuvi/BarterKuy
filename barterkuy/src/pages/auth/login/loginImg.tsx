import { IKImage } from "imagekitio-react";

function LoginImg() {
    return(
        <>
            <div className="flex justify-center">
                <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
                    path="3R.png"
                    transformation={[
                    {
                        quality: "10",
                    },
                    ]}
                    className="w-[90vw]"
                />
            </div>

            <h1 className="font-bold text-center text-xl">Barang Baru, Cara Lama</h1>
        </>
    )
}

export default LoginImg