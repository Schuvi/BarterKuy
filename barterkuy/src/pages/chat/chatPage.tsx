import { useSelector } from "react-redux";
import Chat from "./chat";
import ChatHeader from "./chatHeader";
import { fetchProfileUser, fetchDetailBarang } from "@/hooks/fetchHooks";
import { useParams } from "react-router-dom";
import { RootStatePersist } from "@/redux/redux-persist/store-persist";

function ChatPage() {
  const { target_id, barang_id } = useParams();

  const { data: targetData, isLoading: loadingTarget, isError: errorTarget } = fetchProfileUser(target_id as string);

  const { data: dataBarang } = fetchDetailBarang(barang_id as string);

  const namaBarang = dataBarang?.data[0].nama_barang || [];

  const gambarBarang = dataBarang?.data[0].link_gambar[0] || [];

  const userName = targetData?.data[0].nama_lengkap || [];
  
  const userId = useSelector((state: RootStatePersist) => state.user.user_id)

  const newUserId = String(userId)

  const userImg = targetData?.data[0].gambar_profile;

  return (
    <>
      <section className="p-2 flex flex-col">
        <ChatHeader nama={userName} gambarProfile={userImg} namaBarang={namaBarang} gambarBarang={gambarBarang} receiver_id={newUserId} barang_id={barang_id as string} giver_id={target_id as string} />
        <Chat />
      </section>
    </>
  );
}

export default ChatPage;
