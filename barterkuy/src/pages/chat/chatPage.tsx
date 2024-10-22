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

  const { data: chat } = fetchChatHistory(userId, target_id as string, 20, 0);

  const [msg, setMsg] = useState<stateChat>({
    message: "",
    tujuan: target_id || "", // Set tujuan dari parameter atau default ke string kosong
    listMessage: [],
  });

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
    console.log(msg.listMessage);

    // Pasang listener untuk event 'chat message'
    socket.on("chat message", handleMessage);

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
      <h1>Chat</h1>

      <div className="container">
        {msg.listMessage.map((msgObj, index) => (
          <div key={index} className={`${msgObj.userId === userId ? "text-right" : "text-left"}`}>
            {msgObj.userId}: {msgObj.msg}
          </div>
        ))}
      </div>

      <Input type="text" placeholder="Tujuan" value={msg.tujuan} onChange={(e) => setMsg((prevState) => ({ ...prevState, tujuan: e.target.value }))} />

      <Input type="text" placeholder="Tulis pesan..." value={msg.message} onChange={(e) => setMsg((prevState) => ({ ...prevState, message: e.target.value }))} />

      <Button onClick={sendMessage}>Kirim Pesan</Button>
    </>
  );
}

export default Chat;
