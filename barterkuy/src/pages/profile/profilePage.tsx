import { fetchProfileUser } from "@/hooks/fetchHooks";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import ProfilePicture from "./profilePicture";
import { dataProfile } from "@/types/type";
import { useParams } from "react-router-dom";

function ProfilePage() {
    const {user_id} = useParams()

    const email_user = useSelector((state: RootState) => state.user.email)

    const { data: profile, isLoading: loadingProfile, isError: errorProfile } = fetchProfileUser(user_id as string)

    const profileData = profile?.data || [];

    const dataImage = profileData.find((item: dataProfile) => item.email === email_user)

    if (errorProfile) {
        return <div>error</div>;
    }

  return (
    <>
        <section>
            <ProfilePicture gambar_profile={dataImage?.gambar_profile} user_id={user_id} gambar_id={dataImage?.gambar_id}/>
        </section>
    </>
  );
}

export default ProfilePage;
