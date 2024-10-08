import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// SingnUp Form Handler
const signFormScheme = z
  .object({
    email: z.string().email("Email tidak valid"),
    nama_lengkap: z.string().min(3, "Tulis nama lengkap anda"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    password2: z.string().min(8, "password minimal 8 karakter"),
    nomor_telepon: z.string().min(11, "Nomor minimal 11 karakter"),
    role: z.string(),
    provinsi: z.string().min(1, "Pilih minimal 1 provinsi"),
    kota: z.string().min(1, "Pilih minimal 1 kota"),
    kecamatan: z.string().min(1, "Pilih minimal 1 kecamatan"),
  })
  .refine((data) => data.password === data.password2, {
    message: "Password harus sama",
    path: ["password2"],
  });

type SignFormScheme = z.infer<typeof signFormScheme>;

export const signUpHandler = () => {
  const formSignUp = useForm<SignFormScheme>({
    resolver: zodResolver(signFormScheme),
    defaultValues: {
      role: "user",
    },
  });

  const { handleSubmit, control } = formSignUp;

  return { handleSubmit, control, formSignUp };
};

// Login Form Handler
const loginFormSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(7, "Password minimal harus 7 karakter"),
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

export const LoginHandler = () => {
  const formLogin = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  });

  const { handleSubmit, control } = formLogin;

  return { formLogin, handleSubmit, control };
};

// OTP Form Handler
const otpVerifyScheme = z.object({
  otp: z.string().min(6, "OTP harus memiliki 6 karakter"),
  email: z.string().email("Email tidak valid"),
});

type OtpVerifyScheme = z.infer<typeof otpVerifyScheme>;

export const OtpHandler = (email: string) => {
  const formOtp = useForm<OtpVerifyScheme>({
    resolver: zodResolver(otpVerifyScheme),
    defaultValues: {
      email: email,
    },
  });

  const { handleSubmit, control } = formOtp;

  return { handleSubmit, control, formOtp };
};

// search filter
const searchFilterScheme = z.object({
  provinsi: z.string().min(1, "Pilih minimal 1 provinsi"),
  kabupaten: z.string().min(1, "Pilih minimal 1 kota")
});

type SearchFilterScheme = z.infer<typeof searchFilterScheme>

export const searchFilterHandler = () => {
  const formSearchFilter = useForm<SearchFilterScheme>({
    resolver: zodResolver(searchFilterScheme),
  })

  const {handleSubmit, control} = formSearchFilter

  return {handleSubmit, control, formSearchFilter}
}


// Form Pengajuan
const formPengajuanScheme = z.object({
  user: z.number().min(1, "User ID harus diisi"),
  nama_barang: z.string().min(3, "Nama barang minimal 3 karakter").max(50, "Nama barang maksimal 50 karakter"),
  deskripsi_barang: z.string().min(30, "Deskripsi minimal 30 karakter").max(255, "Deskripsi maksimal 255 karakter"),
  kategori_barang: z.number().min(1, "Pilih 1 dari kategori yang tersedia"),
  lokasi: z.string().min(3, "Lokasi minimal 3 karakter"),
  locNow: z.boolean().default(false).optional(),
  jenis_penawaran: z.string().min(1, "Pilih salah satu dari penawaran yang tersedia"),
})

type FormPengajuanScheme = z.infer<typeof formPengajuanScheme>

export const formPengajuanHandler = () => {
  const user_id = useSelector((state: RootState) => state.user.user_id)

  const formPengajuan = useForm<FormPengajuanScheme>({
    resolver: zodResolver(formPengajuanScheme),
    defaultValues: {
      user: user_id,
    }
  })

  const {handleSubmit, control} = formPengajuan

  return {handleSubmit, control, formPengajuan}
}