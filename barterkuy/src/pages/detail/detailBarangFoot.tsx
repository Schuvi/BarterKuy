import { Button } from "@/components/ui/button";
import likeLogo from "../../assets/heart-regular (1).svg";
import likeFilled from "../../assets/heart-solid (1).svg";
import share from "../../assets/share_500px.png";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { likeBarang } from "@/services/formPostHandler";
import { useEffect, useState } from "react";
import { likeData } from "@/types/type";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

function DetailBarangFoot({ like }: { like: likeData[] }) {
  const {id} = useParams()

  const id_user = useSelector((state: RootState) => state.user.user_id);

  const [isLikedButton, setIsLikedButton] = useState<boolean>(false);

  const MySwal = withReactContent(Swal);

  const mutation = likeBarang();

  const id_barang = Number(id)

  const liked = like.find((item) => item.id === id_barang);

  useEffect(() => {
    if (liked != null) {
      setIsLikedButton(true);
    } else {
      setIsLikedButton(false);
    }
  }, [liked]);

  const handleLike = () => {
    if (isLikedButton) {
      MySwal.fire({
        title: "Gagal",
        text: "Barang telah ditambahkan ke wishlist",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      mutation.mutate({ id_barang, id_user });
    }
  };

  return (
    <>
      <div className="fixed bottom-0 right-0 left-0 flex justify-between items-center h-[8vh] bg-color2 mt-auto p-2">
        <div className="container w-12" onClick={handleLike}>
          <img src={isLikedButton ? likeFilled : likeLogo} alt="logo like" className="h-full w-full" />
        </div>

        <div className="w-[50vw]">
          <Button className="w-full bg-color4 font-bold">Hubungi Pemilik</Button>
        </div>

        <div className="container w-9">
          <img src={share} alt="logo like" className="h-full w-full" />
        </div>
      </div>
    </>
  );
}

export default DetailBarangFoot;
