import { api } from "./axiosConfig";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { update } from "@/redux/userSlice";
import { signUpHandler, LoginHandler, formPengajuanHandler } from "@/hooks/useForm";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useMutation } from "@tanstack/react-query";
import { OtpHandler } from "@/hooks/useForm";
import { useQueryClient } from "@tanstack/react-query";

// Sign Up Post Handler
export const signPostHandler = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { handleSubmit, control, formSignUp } = signUpHandler();

  const handleSignUp = handleSubmit(async (values) => {
    const formData: FormData = new FormData();
    formData.append("email", values.email);
    formData.append("nama_lengkap", values.nama_lengkap);
    formData.append("password", values.password);
    formData.append("nomor_telepon", values.nomor_telepon);
    formData.append("role", values.role);
    formData.append("provinsi", values.provinsi);
    formData.append("kota", values.kota);
    formData.append("kecamatan", values.kecamatan);

    const response = await api.post(import.meta.env.VITE_API_ENDPOINT + "/register", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const emailRes = values.email;

    if (response.data.message === "User creation success") {
      alert("Success");
      dispatch(update({ email: emailRes }));
      navigate("/otpVerification");
    }
  });

  return { control, formSignUp, handleSignUp };
};

// Login Post Handler
export const loginPostHandler = () => {
  const navigate = useNavigate();

  const MySwal = withReactContent(Swal);

  const { handleSubmit, formLogin, control } = LoginHandler();

  const handleLogin = handleSubmit(async (values) => {
    const formData: FormData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const response = await api.post("/login", formData);

      if (response.data.message === "Login success!") {
        MySwal.fire({
          title: "Sign In sukses",
          icon: "success",
          confirmButtonText: "Konfirmasi",
        }).then((result) => {
          if (result.isConfirmed) {
            window.localStorage.setItem("token", response.data.accessToken);
            navigate("/");
          }
        });
      }
    } catch (error) {
      MySwal.fire({
        title: "Error",
        text: "Login failed. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  });

  return { formLogin, control, handleLogin };
};

// OTP Request
export const OtpReqHandler = (email: string) => {
  const MySwal = withReactContent(Swal);

  const dispatch = useDispatch();

  const Toast = MySwal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const sendOtp = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/otp", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.message === "OTP verified successfully") {
        Toast.fire({
          icon: "success",
          title: "OTP berhasil dikirim",
        });
      }
    },
    onError: (error) => {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "Gagal Mengirim OTP",
      });
    },
  });

  const handleOtp = (e: any) => {
    e.preventDefault();

    const formData: FormData = new FormData();
    formData.append("email", email);

    dispatch(update({ pending: true }));

    sendOtp.mutate(formData);
  };

  return { handleOtp };
};

export const OtpPostVerify = (email: string) => {
  const { handleSubmit, formOtp, control } = OtpHandler(email);

  const navigate = useNavigate();

  const MySwal = withReactContent(Swal);

  const handleSubmitOtp = handleSubmit(async (values) => {
    const formData: FormData = new FormData();
    formData.append("otp", values.otp);
    formData.append("email", values.email);

    console.log("email", values.email);

    const response = await api.post("/verify-otp", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.message === "OTP verified successfully") {
      MySwal.fire({
        icon: "success",
        title: "OTP Berhasil Dikonfirmasi",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/");
        }
      });
    }
  });

  return { handleSubmitOtp, formOtp, control };
};

// Hapus like barang
export const DeleteLike = (user_id: number) => {
  const queryClient = useQueryClient();

  const deleteLikeBarang = useMutation({
    mutationFn: async ({ id, user_id }: { id: number; user_id: number }) => {
      const response = await api.post(
        "/delete/liked",
        {},
        {
          params: {
            id_barang: id,
            user_id: user_id,
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.message === "Success delete liked things") {
        alert("Berhasil menghapus barang dari daftar");
        queryClient.invalidateQueries({ queryKey: ["liked", user_id] });
      }
    },
    onError: (error) => {
      alert(error);
    },
  });

  return deleteLikeBarang;
};

export const likeBarang = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ id_barang, id_user }: { id_barang: number; id_user: number }) => {
      const response = await api.post(
        "/post/liked",
        {},
        {
          params: {
            id_barang: id_barang,
            id_user: id_user,
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.message === "Successfull liked things") {
        alert("Berhasil menambahkan barang ke daftar");
        navigate("/liked");
      }
    },
    onError: (error) => {
      alert(error);
    },
  });
};

export const handlePostPengajuan = () => {
  const { handleSubmit, control, formPengajuan } = formPengajuanHandler();

  const handlePostForm = handleSubmit(async (value) => {
    const formData: FormData = new FormData();
    formData.append("user_id", String(value.user));
    formData.append("nama_barang", value.nama_barang);
    formData.append("deskripsi_barang", value.deskripsi_barang);
    formData.append("kategori_barang", String(value.kategori_barang));
    formData.append("lokasi", value.lokasi);
    formData.append("jenis_penawaran", value.jenis_penawaran);
    formData.append("link_gambar", JSON.stringify(value.fileImg));

    const response = await api.post("/post/barang", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response) {
      console.log(response);
    }
  });

  return { control, handlePostForm, formPengajuan };
};
