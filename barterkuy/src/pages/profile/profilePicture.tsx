import { IKImage } from "imagekitio-react"
import { dataImgProfile } from "@/types/type"
import camera from "../../assets/camera_white_500px.png"
import EditProfileImgModal from "@/components/modal/editProfileImg"
import { useState } from "react"

function ProfilePicture({ gambar_profile }: dataImgProfile) {
    const [openModal, setOpenModal] = useState<boolean>(false)

    const handleCloseModal = () => {
        setOpenModal(!openModal)
    }

    return(
        <>
            <div className="container flex justify-center mt-4">
                <div className="container w-[40vw] h-[19vh] rounded-full">
                    <IKImage 
                        urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
                        path={gambar_profile === null ? "/user/blank_profile.png" : gambar_profile}
                        transformation={[{
                            quality: "10"
                        }]}
                        className="object-cover h-full w-full rounded-full"
                    />

                    <div className="relative left-[6.5em] bottom-10" onClick={() => setOpenModal(!openModal)}>
                        <button className="w-[10vw] h-[5vh] rounded-full p-[0.35em] bg-color2">
                            <img src={camera} alt="logo kamera" className="w-full h-full object-contain"/>
                        </button>
                    </div>
                </div>
            </div>
            
            {openModal && <EditProfileImgModal onClose={handleCloseModal}/>}
        </>
    )
}

export default ProfilePicture