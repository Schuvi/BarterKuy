import { api } from "./axiosConfig";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { update } from "@/redux/userSlice";
import { signUpHandler, LoginHandler } from "@/hooks/useForm";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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

    return {formLogin, control, handleLogin}
}