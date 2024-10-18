import { fetchProfileUser } from "@/hooks/fetchHooks";
import { useSelector } from "react-redux";
import ProfilePicture from "./profilePicture";
import ProfileDetail from "./profileDetail";
import { dataProfile } from "@/types/type";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/formPostHandler";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { RootStatePersist } from "@/redux/redux-persist/store-persist";

function ProfilePage() {
  const { user_id } = useParams();

  const MySwal = withReactContent(Swal);

  const signOut = logout();

  const logoutFn = () => {
    MySwal.fire({
      title: "Konfirmasi",
      text: "Apakah kamu yakin ingin logout?",
      icon: "warning",
      confirmButtonText: "Ya, saya ingin logout",
      showDenyButton: true,
      denyButtonText: "Tidak!",
    }).then((response) => {
      if (response.isConfirmed) {
        signOut.mutate();
      }
    });
  };

  const email_user = useSelector((state: RootStatePersist) => state.user.email);

  const { data: profile, isLoading: loadingProfile, isError: errorProfile } = fetchProfileUser(user_id as string);

  const profileData = profile?.data || [];

  const DataProfile = profileData.find((item: dataProfile) => item.email === email_user);

  if (errorProfile) {
    return <div>error</div>;
  }

  return (
    <>
      <section>
        <ProfilePicture gambar_profile={DataProfile?.gambar_profile} user_id={user_id} gambar_id={DataProfile?.gambar_id} isLoading={loadingProfile} />

        <ProfileDetail dataProfile={DataProfile} loadingData={loadingProfile} />

        <div className="container text-center mt-4">
          <Button type="button" className="bg-red-700" onClick={logoutFn}>
            Logout
          </Button>
        </div>
      </section>
    </>
  );
}

export default ProfilePage;
