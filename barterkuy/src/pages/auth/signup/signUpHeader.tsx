import { IKImage } from "imagekitio-react";

function SignUpHeader() {
    return(
        <>
            <div className="container flex flex-col justify-center items-center text-center mb-5">
                <div className="container flex justify-center w-[40vw] mt-5">
                    <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
                    path="barterkuy.png"
                    transformation={[
                        {
                        quality: "100",
                        width: "300",
                        height: "340",
                        cropMode: "extract",
                        },
                    ]}
                    className="h-full"
                    />
                </div>

                <h1 className="text-2xl font-bold">Sign Up BarterKuy!</h1>
            </div>
        </>
    )
}

export default SignUpHeader;