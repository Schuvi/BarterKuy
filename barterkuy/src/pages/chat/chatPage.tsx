import Chat from "./chat";
import ChatHeader from "./chatHeader";
import { fetchProfileUser, fetchDetailBarang } from "@/hooks/fetchHooks";
import { useParams } from "react-router-dom";

function ChatPage() {
  const { target_id, barang_id } = useParams();

  const { data: targetData, isLoading: loadingTarget, isError: errorTarget } = fetchProfileUser(target_id as string);

  const { data: dataBarang } = fetchDetailBarang(barang_id as string);

  const namaBarang = dataBarang?.data[0].nama_barang || [];

  const gambarBarang = dataBarang?.data[0].link_gambar[0] || [];

  const userName = targetData?.data[0].nama_lengkap || [];

  const userImg = targetData?.data[0].gambar_profile;

  return (
    <>
      <section className="p-2 flex flex-col">
        <ChatHeader nama={userName} gambarProfile={userImg} namaBarang={namaBarang} gambarBarang={gambarBarang} />
        <Chat />
      </section>
    </>
  );
}

export default ChatPage;
