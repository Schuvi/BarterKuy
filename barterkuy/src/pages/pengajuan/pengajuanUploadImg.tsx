import imageKitAuthenticator from "@/services/imageKitAuth";
import { IKContext, IKUpload } from 'imagekitio-react';
import { Progress } from "@/components/ui/progress"
import { useState, useRef } from "react";

function GiveThingsUpImg() {
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [fileName, setFileName] = useState<string>("Upload");

    const onError = (err: any) => {
        alert(`error uploading ${err}`)
    };
      
    const onSuccess = (res: any) => {
        alert("Success")
        setUploadProgress(0);
    };

    const onUploadProgress = (progress: any) => {
        const percentageProgress = Math.round((progress.loaded / progress.total) * 100);

        setUploadProgress(percentageProgress);
    };

    const onFileChange = (e: any) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFileName(selectedFile.name);
        }
    };

    const ikUpload = useRef<HTMLInputElement | null>(null)

    return(
        <>
            <div className="container">
                <IKContext 
                    publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY} 
                    urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT} 
                    authenticator={imageKitAuthenticator}
                >
                <IKUpload
                    fileName="barang"
                    onError={onError}
                    onSuccess={onSuccess}
                    folder={"/barang"}
                    useUniqueFileName={true}
                    onUploadProgress={onUploadProgress}
                    className="rounded-lg hidden"
                    onChange={onFileChange}
                    ref={ikUpload}
                />

                {ikUpload && <button onClick={() => ikUpload.current?.click()}>{fileName}</button>}

                    {uploadProgress > 0 && (
                        <div className="mt-7">
                            <Progress value={uploadProgress} />
                            <p>{uploadProgress}%</p>
                        </div>
                    )}
                </IKContext>
            </div>
        </>
    )
}

export default GiveThingsUpImg