import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
