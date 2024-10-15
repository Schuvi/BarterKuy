import { dataProfile } from "@/types/type";
import UserLogoProfile from "./Detailpage/logoDetail";
import UserDetailData from "./Detailpage/profileDetailData";
import userLogo from "../../assets/user_black_96px.png";
import pencil from "../../assets/pencil_500px.png";
import locationLogo from "../../assets/location_filled_500px.png";
import addressBook from "../../assets/address_book_512px.png";
import ModalEditProfileName from "@/components/modal/editProfileName";
import ModalEditProfileTelephone from "@/components/modal/editProfileTelephone";
import { useState } from "react";

function ProfileDetail({ dataProfile, loadingData }: { dataProfile: dataProfile; loadingData: boolean }) {
  const [editNama, setEditNama] = useState<boolean>(false);
  const [editTelephone, setEditTelephone] = useState<boolean>(false);

  if (loadingData) {
    return <div>Loading...</div>;
  }

  const handleCloseNama = () => {
    setEditNama(!editNama);
  };

  const handleCloseTelephone = () => {
    setEditTelephone(!editTelephone);
  };

  return (
    <>
      <div className="container mt-5 flex items-center justify-between p-2">
        <UserLogoProfile logo={userLogo} />
        <UserDetailData title="Nama" data={dataProfile.nama_lengkap} />
        <div className="container w-[10vw]" onClick={() => setEditNama(!editNama)}>
          <img src={pencil} alt="pencil logo" />
        </div>
      </div>
      <div className="container mt-4 flex items-center justify-between p-2">
        <UserLogoProfile logo={addressBook} />
        <UserDetailData title="Nomor Telepon" data={dataProfile.nomor_telepon} />
        <div className="container w-[10vw]" onClick={() => setEditTelephone(!editTelephone)}>
          <img src={pencil} alt="pencil logo" />
        </div>
      </div>
      <div className="container mt-4 flex items-center justify-between p-2">
        <UserLogoProfile logo={locationLogo} />
        <UserDetailData title="Nama" data={`${dataProfile.provinsi}, ${dataProfile.kota}, ${dataProfile.kecamatan}`} />
        <div className="container w-[10vw]">
          <img src={pencil} alt="pencil logo" />
        </div>
      </div>

      {editNama && <ModalEditProfileName onClose={handleCloseNama} />}

      {editTelephone && <ModalEditProfileTelephone onClose={handleCloseTelephone} />}
    </>
  );
}

export default ProfileDetail;
