import io from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootStatePersist } from "@/redux/redux-persist/store-persist";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { stateChat } from "@/types/type";
import { fetchChatHistory } from "@/hooks/fetchHooks";

// Inisialisasi koneksi socket.io
const socket = io("https://192.168.54.173:2024", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

function Chat() {
  const { target_id } = useParams(); // Mendapatkan target ID dari URL
  const user_id = useSelector((state: RootStatePersist) => state.user.user_id);
  const userId = String(user_id); // Konversi user_id ke string

  const hasFetched = useRef(false);

  const hasSend = useRef(false);

  const { data: chat } = fetchChatHistory(userId, target_id as string, 20, 0);

  const [msg, setMsg] = useState<stateChat>({
    message: "",
    tujuan: target_id || "", // Set tujuan dari parameter atau default ke string kosong
    listMessage: [],
  });

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Scroll ke bawah saat ada perubahan di listMessage
  }, [msg.listMessage]);

  useEffect(() => {

    // Emit event login ketika user terhubung
    socket.emit("login", userId);
    console.log(`User ${userId} logged in`);

    // Emit event untuk join ke room tujuan
    if (target_id) {
      socket.emit("kontak tujuan", target_id);
      console.log(`User bergabung ke room tujuan: ${target_id}`);
    }

    // Handle pesan baru
    const handleMessage = (msgObj: { msg: string; userId: string }) => {
      console.log("Pesan diterima di frontend:", msgObj); // Debugging
      setMsg((prevState) => ({
        ...prevState,
        listMessage: [...prevState.listMessage, msgObj],
      }));
    };

    // Pasang listener untuk event 'chat message'
    socket.on("chat message", handleMessage);

    hasSend.current = true;

    // Cleanup socket event listener ketika komponen di-unmount
    return () => {
      socket.off("chat message", handleMessage);
    };
  }, [target_id, userId]);

  useEffect(() => {
    if (chat && chat.length > 0 && !hasFetched.current) {
      const msgObj = chat.map((item: { sender: number; chat: string }) => ({
        msg: item.chat,
        userId: String(item.sender),
      }));

      setMsg((prevState) => ({
        ...prevState,
        listMessage: [...prevState.listMessage, ...msgObj],
      }));

      console.log(msg.listMessage);

      hasFetched.current = true;
    }
  }, [chat]);

  const sendMessage = () => {
    const msgObj = { msg: msg.message, userId };

    // Update listMessage secara lokal
    setMsg((prevState) => ({
      ...prevState,
      listMessage: [...prevState.listMessage, msgObj],
    }));

    // Emit event chat message dengan pesan, tujuan, dan userId
    console.log("Mengirim pesan:", msg.message, msg.tujuan, userId);
    socket.emit("chat message", msg.message, msg.tujuan, userId);

    // Reset input message setelah pesan dikirim
    setMsg((prevState) => ({
      ...prevState,
      message: "",
    }));
  };

  return (
    <>
      <section>
        <div className="container overflow-y-auto h-[50vh] mb-2">
          {msg.listMessage.map((msgObj, index) => (
            <div key={index} className={`flex ${msgObj.userId === userId ? "justify-end" : "justify-start"} mb-2`}>
              <div
                className={`${msgObj.userId === userId ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} p-3 ${
                  msgObj.userId === userId ? "rounded-ss-xl rounded-se-xl rounded-es-xl" : "rounded-ss-xl rounded-se-xl rounded-ee-xl"
                } max-w-xs`}
              >
                {msgObj.msg}
              </div>
            </div>
          ))}
          <div ref={messageEndRef}></div>
        </div>

        <div className={`container flex absolute gap-4 bottom-0 left-0 right-0 p-2 mb-10`}>
          <Input type="text" placeholder="Tujuan" className="hidden" value={msg.tujuan} onChange={(e) => setMsg((prevState) => ({ ...prevState, tujuan: e.target.value }))} />
          <Input type="text" placeholder="Tulis pesan..." value={msg.message} onChange={(e) => setMsg((prevState) => ({ ...prevState, message: e.target.value }))} />

          <Button type="button" className="bg-color2" onClick={sendMessage} disabled={msg.message === ""}>
            Kirim Pesan
          </Button>
        </div>
      </section>
    </>
  );
}

export default Chat;
