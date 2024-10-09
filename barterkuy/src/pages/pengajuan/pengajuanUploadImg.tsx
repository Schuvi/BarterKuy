import imageKitAuthenticator from "@/services/imageKitAuth";
import { IKContext, IKUpload } from "imagekitio-react";
import { Progress } from "@/components/ui/progress";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { update } from "@/redux/userSlice";

function GiveThingsUpImg() {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileName, setFileName] = useState<string>("Upload Gambar Barang");

  const dispatch = useDispatch()

  const onError = (err: any) => {
    alert(`error uploading ${err}`);
  };

  const onSuccess = (res: any) => {
    alert("Success");
    dispatch(update({fileUpload: res.filePath}))
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

  const ikUpload = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <div className="container text-center mt-3">
        <IKContext publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY} urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT} authenticator={imageKitAuthenticator}>
          <IKUpload fileName="barang" onError={onError} onSuccess={onSuccess} folder={"/barang"} useUniqueFileName={true} onUploadProgress={onUploadProgress} className="rounded-lg hidden" onChange={onFileChange} ref={ikUpload} />

          {ikUpload && <Button className="w-[50vw]" onClick={() => ikUpload.current?.click()}>{fileName}</Button>}

          {uploadProgress > 0 && (
            <div className="mt-7">
              <Progress value={uploadProgress} />
              <p>{uploadProgress}%</p>
            </div>
          )}
        </IKContext>
      </div>
    </>
  );
}

export default GiveThingsUpImg;
