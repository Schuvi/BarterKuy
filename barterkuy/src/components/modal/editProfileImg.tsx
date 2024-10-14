import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import imageKitAuthenticator from "@/services/imageKitAuth";
import { IKContext, IKUpload, IKImage } from "imagekitio-react";
import { useRef, useState } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { handleEditImgProfile } from "@/services/formPostHandler";

function EditProfileImgModal({ cancel, gambar_id, user_id }: { cancel: () => void; gambar_id: string; user_id: string }) {
  const queryClient = useQueryClient();

  const [image, setImage] = useState<string>("");

  const [imageId, setImageId] = useState<string>("");

  const [upload, setUpload] = useState<string>("");

  const [ganti, setGanti] = useState<string>("hidden");

  const [uploadProcess, setUploadProcess] = useState<boolean>(false);

  const MySwal = withReactContent(Swal);

  const IkRefUp = useRef<HTMLInputElement | null>(null);

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
    }).then((response) => {
      if (response.isConfirmed) {
        setUploadProcess(false);
      }
    });

    setUpload("hidden");
    setGanti("");

    setImage(res.filePath);
    setImageId(res.fileId);
  };

  const gantiProfile = async () => {
    const processImg = await handleEditImgProfile(image, gambar_id, imageId, user_id);

    if (processImg) {
      await queryClient.invalidateQueries({ queryKey: ["profile", user_id] });
      cancel();
    } else if (processImg === false) {
      MySwal.fire({
        title: "Galat",
        text: "Gagal mengunggah gambar",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
        <IKContext publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY} urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT} authenticator={imageKitAuthenticator}>
          <Card>
            <CardHeader>
              <CardTitle>Ganti Gambar Profile</CardTitle>
              <CardDescription>Upload gambar baru yang akan anda gunakan</CardDescription>
            </CardHeader>
            <CardContent>
              <h1 className="font-bold text-lg">Preview</h1>

              <div className="container flex justify-center">
                <IKImage
                  urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
                  path={image === "" ? "/user/blank_profile.png" : image}
                  transformation={[
                    {
                      quality: "100",
                    },
                  ]}
                  className="w-[40vw] h-[19vh] object-cover rounded-full"
                />
              </div>

              {uploadProcess && (
                <>
                  <h1>Uploading...</h1>
                </>
              )}
            </CardContent>
            <CardFooter>
              <div className="container flex flex-col items-center justify-between h-20 text-center">
                <Button onClick={() => IkRefUp.current?.click()} className={`w-[30vw] bg-color2 ${upload}`}>
                  Upload Image
                </Button>
                <Button type="button" onClick={gantiProfile} className={`w-[30vw] bg-color2 ${ganti}`}>
                  Ganti Profile
                </Button>
                <Button onClick={cancel} className="w-[20vw] bg-red-600">
                  Batal
                </Button>
              </div>
            </CardFooter>
          </Card>
          <IKUpload fileName="user" onSuccess={onSuccess} onError={onError} folder="/user" useUniqueFileName={true} onUploadStart={() => setUploadProcess(true)} className="hidden" ref={IkRefUp} />
        </IKContext>
      </div>
    </>
  );
}

export default EditProfileImgModal;
