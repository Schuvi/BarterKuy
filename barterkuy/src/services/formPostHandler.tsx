import { api } from "./axiosConfig";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { update } from "@/redux/userSlice";
import { signUpHandler, LoginHandler, formPengajuanHandler, editProfileNameHandler, editProfileTelephoneHandler, editProfileLocationHandler, changePasswordHandler } from "@/hooks/useForm";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useMutation } from "@tanstack/react-query";
import { OtpHandler } from "@/hooks/useForm";
import { useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// Sign Up Post Handler
export const signPostHandler = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const MySwal = withReactContent(Swal);

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

    try {
      const response = await api.post(import.meta.env.VITE_API_ENDPOINT + "/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const emailRes = values.email;

      if (response.data.message === "User creation success") {
        MySwal.fire({
          title: "Berhasil",
          text: "Akun berhasil dibuat",
          icon: "success",
          confirmButtonText: "OK",
        });
        dispatch(update({ email: emailRes }));
        navigate("otp_verification");
      }
    } catch (error) {
      if (error) {
        MySwal.fire({
          title: "Gagal",
          text: "Nama / Email Telah Digunakan",
          icon: "error",
        });
      }
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

  const MySwal = withReactContent(Swal);

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
        MySwal.fire({
          title: "Berhasil",
          text: "Berhasil menghapus barang dari whistlist",
          icon: "success",
          confirmButtonText: "OK",
        });
        queryClient.invalidateQueries({ queryKey: ["liked", user_id] });
      }
    },
    onError: (error) => {
      MySwal.fire({
        title: "Gagal",
        text: "Gagal menghapus barang",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  return deleteLikeBarang;
};

export const likeBarang = () => {
  const navigate = useNavigate();

  const MySwal = withReactContent(Swal);

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
        MySwal.fire({
          title: "Success",
          text: "Berhasil ditambahkan ke wishlist",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/liked");
      }
    },
    onError: (error) => {
      MySwal.fire({
        title: "Gagal",
        text: "Gagal menambahkan ke wishlist",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });
};

export const handlePostPengajuan = () => {
  const { handleSubmit, control, formPengajuan } = formPengajuanHandler();

  const MySwal = withReactContent(Swal);

  const handlePostForm = handleSubmit(async (value) => {
    if (value.fileImg.length < 1) {
      MySwal.fire({
        title: "Error",
        text: "Silahkan mengunggah minimal 1 gambar!",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
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
    }
  });

  return { control, handlePostForm, formPengajuan };
};

export const handleEditImgProfile = async (gambar_profile: string, oldImgId: string, newImgId: string, user_id: string) => {
  const response = await api.post(
    "/delete/img",
    {},
    {
      params: {
        fileId: oldImgId,
      },
    }
  );

  if (response.data.statusCode === 200) {
    await api.post(
      "/update/profile/img",
      {},
      {
        params: {
          gambar_profile: gambar_profile,
          gambar_id: newImgId,
          user_id: user_id,
        },
      }
    );

    return true;
  } else if (response.data.statusCode === 400) {
    return false;
  }
};

export const handleEditNameProfile = (onClose: () => void) => {
  const { handleSubmit, control, formEditName } = editProfileNameHandler();

  const queryClient = useQueryClient();

  const MySwal = withReactContent(Swal);

  const formData: FormData = new FormData();

  const handlePostEditName = handleSubmit(async (value) => {
    const user = String(value.user);

    formData.append("nama_lengkap", value.nama_lengkap);
    formData.append("user_id", user);
    formData.append("nomor_telepon", "");
    formData.append("password", "");

    try {
      const response = await api.post("/edit/profile", formData);

      if (response.status === 200) {
        MySwal.fire({
          title: "Berhasil",
          text: "Nama anda berhasil diubah",
          icon: "success",
          confirmButtonText: "OK",
        }).then((response) => {
          if (response.isConfirmed) {
            queryClient.invalidateQueries({ queryKey: ["profile", user] });

            onClose();
          }
        });
      }
    } catch (error) {
      MySwal.fire({
        title: "Gagal",
        text: "Nama sudah terpakai, harap pilih nama lain",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  });

  return { control, formEditName, handlePostEditName };
};

export const handleEditTelephoneProfile = (onClose: () => void) => {
  const { handleSubmit, control, formEditTelephone } = editProfileTelephoneHandler();

  const queryClient = useQueryClient();

  const MySwal = withReactContent(Swal);

  const formData: FormData = new FormData();

  const handlePostEditTelephone = handleSubmit(async (value) => {
    const user = String(value.user);

    formData.append("nama_lengkap", "");
    formData.append("user_id", user);
    formData.append("nomor_telepon", value.nomor_telepon);
    formData.append("password", "");

    try {
      const response = await api.post("/edit/profile", formData);

      if (response.status === 200) {
        MySwal.fire({
          title: "Berhasil",
          text: "Nomor telepon anda berhasil diubah",
          icon: "success",
          confirmButtonText: "OK",
        }).then((response) => {
          if (response.isConfirmed) {
            queryClient.invalidateQueries({ queryKey: ["profile", user] });

            onClose();
          }
        });
      }
    } catch (error) {
      MySwal.fire({
        title: "Gagal",
        text: "Gagal mengganti nomor telepon, coba lagi nanti",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  });

  return { control, formEditTelephone, handlePostEditTelephone };
};

export const handleEditLocationProfile = (onClose: () => void) => {
  const { control, formEditLocation, handleSubmit } = editProfileLocationHandler();

  const MySwal = withReactContent(Swal);

  const queryClient = useQueryClient();

  const handlePostEditLocation = handleSubmit(async (value) => {
    const user = String(value.user);

    const formData: FormData = new FormData();
    formData.append("user_id", user);
    formData.append("provinsi", value.provinsi);
    formData.append("kota", value.kota);
    formData.append("kecamatan", value.kecamatan);

    try {
      const response = await api.post("/edit/profile/location", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status == 200) {
        MySwal.fire({
          title: "Berhasil",
          text: "Lokasi anda berhasil diubah",
          icon: "success",
          confirmButtonText: "OK",
        }).then(async (response) => {
          if (response.isConfirmed) {
            await queryClient.invalidateQueries({ queryKey: ["profile", user] });
            onClose();
          }
        });
      }
    } catch (error) {
      MySwal.fire({
        title: "Gagal",
        text: `Gagal mengubah lokasi, coba lagi nanti ${error}`,
        icon: "error",
      });
    }
  });

  return { control, handlePostEditLocation, formEditLocation };
};

export const handlePostChangePassword = (onClose: () => void) => {
  const MySwal = withReactContent(Swal);

  const { control, handleSubmit, formPassword } = changePasswordHandler();

  const handleChangePassword = handleSubmit(async (value) => {
    const user = String(value.user);

    const formData: FormData = new FormData();

    formData.append("nama_lengkap", "");
    formData.append("nomor_telepon", "");
    formData.append("password", value.password);
    formData.append("old_password", value.old_password);
    formData.append("user_id", user);

    try {
      const response = await api.post("/edit/profile", formData);

      if (response.status == 200) {
        MySwal.fire({
          title: "Berhasil",
          text: "Berhasil mengubah password",
          icon: "success",
          confirmButtonText: "OK",
        }).then((response) => {
          if (response.isConfirmed) {
            onClose();
          }
        });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorStatus = error.response?.status;
        const errorMessage = error.response?.data.message

        if (errorMessage === "Password is incorrect") {
          MySwal.fire({
            title: "Gagal",
            text: "Password lama tidak sesuai",
            icon: "error",
          });
        } else if (errorStatus == 500) {
          MySwal.fire({
            title: "Gagal",
            text: "Terjadi kesalahan pada server",
            icon: "error",
          });
        }
      }
    }
  });

  return { control, formPassword, handleChangePassword };
};

export const logout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post(
        "/logout",
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
};
