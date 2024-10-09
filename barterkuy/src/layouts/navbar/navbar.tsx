import homeImg from "../../assets/home_512px.png";
import chatImg from "../../assets/chat_96px.png";
import giveImg from "../../assets/give_500px.png";
import receiveImg from "../../assets/sell_500px.png";
import searchImg from "../../assets/search_filled_500px.png";
import userImg from "../../assets/user_96px.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { update } from "@/redux/userSlice";
import { RootState } from "@/redux/store";

function Navbar() {
  const navigate = useNavigate();

  const location = useLocation()

  const dispatch = useDispatch();

  const kategoriNow = useSelector((state: RootState) => state.user.kategori);

  const handleKategori = (kategori: string) => {
    if (kategoriNow !== kategori) {
      dispatch(update({ kategori: kategori }));
    } else if (kategoriNow === kategori) {
      dispatch(update({ kategori: "" }));
    }
  };

  return (
    <>
      <nav className="bg-color2 flex h-[7vh] p-2">
        <div className="container flex flex-row justify-around h-full">
          <img src={homeImg} alt="home" className="w-[10vw]" onClick={() => navigate("/")} />
          <img src={chatImg} alt="chat" className="w-[10vw]" />
          <img src={receiveImg} alt="receive" className="w-[10vw]" />
          <img src={giveImg} alt="give" className="w-[10vw]" onClick={() => navigate("/give")}/>
          <img src={searchImg} alt="search" className="w-[10vw]" onClick={() => navigate("/search")}/>
          <img src={userImg} alt="user" className="w-[10vw]" />
        </div>
      </nav>

      {location.pathname === "/" && (
        <nav className="bg-color2 p-2 flex flex-row gap-2 overflow-y-auto">
          <div className={`container w-fit bg-[#D9D9D9] p-1 px-5 rounded-2xl ${kategoriNow === "1" ? "bg-color4" : "bg-[#D9D9D9]"}`} onClick={() => handleKategori("1")}>
            <h1 className="">Elektronik</h1>
          </div>
          <div className={`container w-fit bg-[#D9D9D9] p-1 px-5 rounded-2xl ${kategoriNow === "2" ? "bg-color4" : "bg-[#D9D9D9]"}`} onClick={() => handleKategori("2")}>
            <h1 className="">Fashion</h1>
          </div>
          <div className={`container w-fit bg-[#D9D9D9] p-1 px-5 rounded-2xl ${kategoriNow === "3" ? "bg-color4" : "bg-[#D9D9D9]"}`} onClick={() => handleKategori("3")}>
            <h1 className="">Perabotan</h1>
          </div>
          <div className={`container w-fit bg-[#D9D9D9] p-1 px-5 rounded-2xl ${kategoriNow === "4" ? "bg-color4" : "bg-[#D9D9D9]"}`} onClick={() => handleKategori("4")}>
            <h1 className="">Media</h1>
          </div>
          <div className={`container w-fit bg-[#D9D9D9] p-1 px-5 rounded-2xl ${kategoriNow === "5" ? "bg-color4" : "bg-[#D9D9D9]"}`} onClick={() => handleKategori("5")}>
            <h1 className="">Olahraga</h1>
          </div>
          <div className={`container w-fit bg-[#D9D9D9] p-1 px-5 rounded-2xl ${kategoriNow === "6" ? "bg-color4" : "bg-[#D9D9D9]"}`} onClick={() => handleKategori("6")}>
            <h1 className="">Koleksi</h1>
          </div>
        </nav>
      )}

    </>
  );
}

export default Navbar;
