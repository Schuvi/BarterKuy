import imageKitAuthenticator from "@/services/imageKitAuth";
import { IKContext, IKUpload, IKImage } from "imagekitio-react";
import { Progress } from "@/components/ui/progress";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { update } from "@/redux/userSlice";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

function GiveThingsUpImg() {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ fileName: string; filePath: string }>>([]);
  const [showPlus, setShowPlus] = useState<boolean>(true);
  const dispatch = useDispatch();

  const MySwal = withReactContent(Swal)

  const onError = (err: any) => {
    MySwal.fire({
        title: "Gagal mengunggah gambar",
        text: `Upload error ${err}`,
        icon: "error",
        confirmButtonText: "OK",
    });
  };

  const onSuccess = (res: any) => {
    MySwal.fire({
        title: "Berhasil",
        text: "Berhasil mengunggah gambar",
        icon: "success",
        confirmButtonText: "OK",
    });
    setUploadProgress(0);
    setShowPlus(true);

    const newFile = { fileName: res.name, filePath: res.filePath, fileId: res.fileId };
    setUploadedFiles((prevFiles) => [...prevFiles, newFile]);

    dispatch(update({ fileUpload: [...uploadedFiles, newFile] }));
  };

  const onUploadProgress = (progress: any) => {
    const percentageProgress = Math.round((progress.loaded / progress.total) * 100);
    setUploadProgress(percentageProgress);
  };

  const onFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setShowPlus(false);
    }
  };

  const ikUpload = useRef<HTMLInputElement | null>(null);

  return (
    <div className="container text-center mt-3">
      <IKContext publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY} urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT} authenticator={imageKitAuthenticator}>
        <div className="flex flex-wrap justify-center gap-4">
          {uploadedFiles.length > 0 &&
            uploadedFiles.map((file, index) => (
              <div key={index} className="p-2 border border-gray-300 rounded-lg">
                <IKImage urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT} path={file.filePath} transformation={[{ quality: "10" }]} alt={`Image ${index + 1}`} className="h-24 w-24 object-cover rounded" />
              </div>
            ))}

          {showPlus && (
            <button className="h-24 w-24 border border-gray-400 text-gray-500 rounded flex items-center justify-center text-2xl hover:bg-gray-200" onClick={() => ikUpload.current?.click()} type="button">
              +
            </button>
          )}
        </div>

        <IKUpload fileName="barang" onError={onError} onSuccess={onSuccess} folder={"/barang"} useUniqueFileName={true} onUploadProgress={onUploadProgress} className="hidden" onChange={onFileChange} multiple={false} ref={ikUpload} />

        {uploadProgress > 0 && (
          <div className="mt-7">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}%</p>
          </div>
        )}
      </IKContext>
    </div>
  );
}

export default GiveThingsUpImg;
