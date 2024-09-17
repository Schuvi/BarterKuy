import homeImg from "../../assets/home_512px.png";
import chatImg from "../../assets/chat_96px.png";
import giveImg from "../../assets/give_500px.png";
import receiveImg from "../../assets/sell_500px.png";
import searchImg from "../../assets/search_filled_500px.png";
import userImg from "../../assets/user_96px.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="bg-color2 flex h-[7vh] p-2">
        <div className="container flex flex-row justify-around h-full">
          <img src={homeImg} alt="home" className="w-[10vw]" onClick={() => navigate("/")} />
          <img src={chatImg} alt="chat" className="w-[10vw]" />
          <img src={giveImg} alt="give" className="w-[10vw]" />
          <img src={receiveImg} alt="receive" className="w-[10vw]" />
          <img src={searchImg} alt="search" className="w-[10vw]" />
          <img src={userImg} alt="user" className="w-[10vw]" />
        </div>
      </nav>

      <nav className="bg-color2 p-2 flex flex-row gap-2 overflow-y-auto">
        <div className="container w-fit bg-[#D9D9D9] p-1 px-5 rounded-2xl">
          <h1 className="">Elektronik</h1>
        </div>
        <div className="container w-fit bg-[#D9D9D9] p-1 px-5 rounded-2xl">
          <h1 className="">Fashion</h1>
        </div>
        <div className="container w-fit bg-[#D9D9D9] p-1 px-5 rounded-2xl">
          <h1 className="">Peabotan</h1>
        </div>
        <div className="container w-fit bg-[#D9D9D9] p-1 px-5 rounded-2xl">
          <h1 className="">Media</h1>
        </div>
        <div className="container w-fit bg-[#D9D9D9] p-1 px-5 rounded-2xl">
          <h1 className="">Olahraga</h1>
        </div>
        <div className="container w-fit bg-[#D9D9D9] p-1 px-5 rounded-2xl">
          <h1 className="">Koleksi</h1>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
