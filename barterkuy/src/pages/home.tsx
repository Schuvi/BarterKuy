import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import locationImg from "../assets/location_filled_500px.png";
import { usePosts } from "@/function/function";
import { IKImage } from "imagekitio-react";

interface postsData {
  id: number;
  nama_barang: string;
  deskripsi_barang: string;
  lokasi: string;
  jenis_penawaran: string;
  status_pengajuan: string;
  status_barter: string | null;
  kategori: string;
  nama_lengkap: string;
  link_gambar: string;
}

interface ReducedPost extends Omit<postsData, "link_gambar"> {
  link_gambar: string[];
}

function Home() {
  const accessToken = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const { data: posts } = usePosts();

  const logout = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        import.meta.env.VITE_API_ENDPOINT + "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.message === "Logout succesful") {
        window.localStorage.removeItem("token");
        navigate("/login");
      }
    },
  });

  const postingan = posts?.data.reduce((acc: ReducedPost[], item: postsData) => {
    const existing = acc.find((el) => el.id === item.id);

    if (existing) {
      existing.link_gambar.push(item.link_gambar);
    } else {
      acc.push({
        ...item,
        link_gambar: [item.link_gambar],
      });
    }

    return acc;
  }, []);

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <>
      <section className="h-[7vh] flex flex-row justify-between p-2">
        <div className="container h-full flex">
          <h1>Pilihan hari ini</h1>
        </div>

        <div className="container h-full flex justify-end">
          <img src={locationImg} alt="location logo" className="w-[7vw] h-[3vh]" />
          <p>Jakarta Timur - 5km</p>
        </div>
      </section>

      <section className="p-2">
        <div className="container p-2 flex justify-start gap-x-6 gap-y-3 flex-wrap">
          {postingan?.map((item: postsData) => (
            <div className="container bg-[#D9D9D9] w-[42vw] rounded-xl p-2 h-fit" key={item.id}>
              <IKImage
                urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
                path={item.link_gambar[0]}
                transformation={[
                  {
                    quality: "10",
                  },
                ]}
                className="rounded-lg"
              />

              <div className="container mt-2">
                <h1 className="font-bold text-md mb-2">{item.nama_barang.length >= 15 ? `${item.nama_barang.slice(0,15)}...` : item.nama_barang}</h1>

                <p className="mb-2 text-sm">{item.deskripsi_barang.length >= 50 ? `${item.deskripsi_barang.slice(0, 50)}...` : item.deskripsi_barang}</p>

                <h2 className="text-end text-sm text-color1">{item.lokasi}</h2>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button onClick={() => handleLogout()} hidden={accessToken === null ? true : false}>
        logout
      </button>
    </>
  );
}

export default Home;
