import { dataProfile } from "@/types/type";
import UserLogoProfile from "./Detailpage/logoDetail";
import UserDetailData from "./Detailpage/profileDetailData";
import userLogo from "../../assets/user_black_96px.png";
import pencil from "../../assets/pencil_500px.png";
import locationLogo from "../../assets/location_filled_500px.png";
import addressBook from "../../assets/address_book_512px.png";
import ModalEditProfileName from "@/components/modal/editProfileName";
import ModalEditProfileTelephone from "@/components/modal/editProfileTelephone";
import ModalEditProfileLocation from "@/components/modal/editProfileLocation";
import ModalEditProfilePassword from "@/components/modal/editProfilePassword";
import { useState } from "react";
import { editState } from "@/types/type";
import { Button } from "@/components/ui/button";

function ProfileDetail({ dataProfile, loadingData }: { dataProfile: dataProfile; loadingData: boolean }) {
  const [editState, setEditState] = useState<editState>({
    nama: false,
    telephone: false,
    location: false,
    password: false,
  });

  if (loadingData) {
    return <div>Loading...</div>;
  }

  const handleCloseNama = () => {
    setEditState((prevState) => ({
      ...prevState,
      nama: !editState.nama,
    }));
  };

  const handleCloseTelephone = () => {
    setEditState((prevState) => ({
      ...prevState,
      telephone: !editState.telephone,
    }));
  };

  const handleCloseLocation = () => {
    setEditState((prevState) => ({
      ...prevState,
      location: !editState.location,
    }));
  };
  
  const handleClosePassword = () => {
    setEditState((prevState) => ({
      ...prevState,
      password: !editState.password,
    }));
  };

  return (
    <>
      <div className="container mt-5 flex items-center justify-between p-2">
        <UserLogoProfile logo={userLogo} />
        <UserDetailData title="Nama" data={dataProfile.nama_lengkap} />
        <div
          className="container w-[10vw]"
          onClick={() =>
            setEditState((prevState) => ({
              ...prevState,
              nama: !editState.nama,
            }))
          }
        >
          <img src={pencil} alt="pencil logo" />
        </div>
      </div>

      <div className="container mt-4 flex items-center justify-between p-2">
        <UserLogoProfile logo={addressBook} />
        <UserDetailData title="Nomor Telepon" data={dataProfile.nomor_telepon} />
        <div
          className="container w-[10vw]"
          onClick={() =>
            setEditState((prevState) => ({
              ...prevState,
              telephone: !editState.telephone,
            }))
          }
        >
          <img src={pencil} alt="pencil logo" />
        </div>
      </div>

      <div className="container mt-4 flex items-center justify-between p-2">
        <UserLogoProfile logo={locationLogo} />
        <UserDetailData title="Nama" data={`${dataProfile.provinsi}, ${dataProfile.kota}, ${dataProfile.kecamatan}`} />
        <div
          className="container w-[10vw]"
          onClick={() =>
            setEditState((prevState) => ({
              ...prevState,
              location: !editState.location,
            }))
          }
        >
          <img src={pencil} alt="pencil logo" />
        </div>
      </div>

      <div className="container mt-4 text-center">
        <Button className="bg-color4" type="button" onClick={() => {
          setEditState(prevState => ({
            ...prevState,
            password: !editState.password
          }))
        }}>
          Ganti Password
        </Button>
      </div>

      {editState.nama && <ModalEditProfileName onClose={handleCloseNama} />}

      {editState.telephone && <ModalEditProfileTelephone onClose={handleCloseTelephone} />}

      {editState.location && <ModalEditProfileLocation onClose={handleCloseLocation} />}

      {editState.password && <ModalEditProfilePassword onClose={handleClosePassword}/>}
    </>
  );
}

export default ProfileDetail;
