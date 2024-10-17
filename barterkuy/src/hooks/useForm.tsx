import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";

// SignUp Form Handler
const signFormScheme = z
  .object({
    email: z.string().email("Email tidak valid"),
    nama_lengkap: z.string().min(3, "Tulis nama lengkap anda"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil")
      .regex(/[0-9]/, "Password harus mengandung minimal 1 angka")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar")
      .regex(/[\W_]/, "Password harus mengandung minimal 1 simbol"),
    password2: z.string().min(8, "password minimal 8 karakter"),
    nomor_telepon: z.string().min(11, "Nomor minimal 11 karakter"),
    role: z.string(),
    provinsi: z.string().min(1, "Pilih minimal 1 provinsi"),
    kota: z.string().min(1, "Pilih minimal 1 kota"),
    kecamatan: z.string().min(1, "Pilih minimal 1 kecamatan"),
  })
  .refine((data) => data.password === data.password2, {
    message: "Password tidak sesuai",
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
  kabupaten: z.string().min(1, "Pilih minimal 1 kota"),
});

type SearchFilterScheme = z.infer<typeof searchFilterScheme>;

export const searchFilterHandler = () => {
  const formSearchFilter = useForm<SearchFilterScheme>({
    resolver: zodResolver(searchFilterScheme),
  });

  const { handleSubmit, control } = formSearchFilter;

  return { handleSubmit, control, formSearchFilter };
};

// Form Pengajuan
const formPengajuanScheme = z.object({
  user: z.number().min(1, "User ID harus diisi"),
  nama_barang: z.string().min(3, "Nama barang minimal 3 karakter").max(50, "Nama barang maksimal 50 karakter"),
  deskripsi_barang: z.string().min(30, "Deskripsi minimal 30 karakter").max(255, "Deskripsi maksimal 255 karakter"),
  kategori_barang: z.number().min(1, "Pilih 1 dari kategori yang tersedia"),
  lokasi: z.string().min(3, "Lokasi minimal 3 karakter"),
  locNow: z.boolean().default(false).optional(),
  jenis_penawaran: z.string().min(1, "Pilih salah satu dari penawaran yang tersedia"),
  fileImg: z.array(z.object({ fileName: z.string(), filePath: z.string(), fileId: z.string() })),
});

type FormPengajuanScheme = z.infer<typeof formPengajuanScheme>;

export const formPengajuanHandler = () => {
  const user_id = useSelector((state: RootState) => state.user.user_id);

  const fileImg = useSelector((state: RootState) => state.user.fileUpload);

  const location = useSelector((state: RootState) => state.user.kabupaten);

  const isDisabled = useSelector((state: RootState) => state.user.disabledLoc);

  const formPengajuan = useForm<FormPengajuanScheme>({
    resolver: zodResolver(formPengajuanScheme),
    defaultValues: {
      user: user_id,
      fileImg: [],
      lokasi: isDisabled ? location : "",
    },
  });

  const { handleSubmit, control, setValue } = formPengajuan;

  useEffect(() => {
    if (fileImg) {
      setValue("fileImg", fileImg);
    }
  }, [fileImg]);

  useEffect(() => {
    if (isDisabled) {
      setValue("lokasi", location);
    }
  }, [isDisabled, location]);

  return { handleSubmit, control, formPengajuan };
};

// Edit nama profile
const editProfileNameScheme = z.object({
  user: z.number().min(1, "User ID harus diisi"),
  nama_lengkap: z.string().min(3, "Nama minimal 3 karakter").max(50, "Nama maksimal 50 karakter"),
});

type profileNameScheme = z.infer<typeof editProfileNameScheme>;

export const editProfileNameHandler = () => {
  const user_id = useSelector((state: RootState) => state.user.user_id);

  const formEditName = useForm<profileNameScheme>({
    resolver: zodResolver(editProfileNameScheme),
    defaultValues: {
      user: user_id,
    },
  });

  const { handleSubmit, control } = formEditName;

  return { formEditName, handleSubmit, control };
};

// Edit telpon profile
const editProfileTelephoneScheme = z.object({
  user: z.number().min(1, "User ID harus diisi"),
  nomor_telepon: z.string().min(10, "Nomor telepon minimal 10 karakter").max(12, "Nama maksimal 12 karakter"),
});

type profileTelephoneScheme = z.infer<typeof editProfileTelephoneScheme>;

export const editProfileTelephoneHandler = () => {
  const user_id = useSelector((state: RootState) => state.user.user_id);

  const formEditTelephone = useForm<profileTelephoneScheme>({
    resolver: zodResolver(editProfileTelephoneScheme),
    defaultValues: {
      user: user_id,
    },
  });

  const { handleSubmit, control } = formEditTelephone;

  return { formEditTelephone, handleSubmit, control };
};

// Edit Lokasi Profile
const editProfileLocationScheme = z.object({
  user: z.number().min(1, "User ID harus diisi"),
  provinsi: z.string().min(1, "Pilih minimal 1 provinsi"),
  kota: z.string().min(1, "Pilih minimal 1 kota"),
  kecamatan: z.string().min(1, "Pilih minimal 1 kecamatan"),
});

type editProfileLocationType = z.infer<typeof editProfileLocationScheme>;

export const editProfileLocationHandler = () => {
  const user_id = useSelector((state: RootState) => state.user.user_id);

  const formEditLocation = useForm<editProfileLocationType>({
    resolver: zodResolver(editProfileLocationScheme),
    defaultValues: {
      user: user_id,
    },
  });

  const { handleSubmit, control } = formEditLocation;

  return { handleSubmit, control, formEditLocation };
};

// Ganti Password
const changePasswordScheme = z
  .object({
    old_password: z.string().min(8, "Password minimal 8 karakter"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar")
      .regex(/[0-9]/, "Password harus mengandung minimal 1 angka")
      .regex(/[\W_]/, "Password harus mengandung minimal 1 simbol"),
    confirm_password: z.string().min(8, "Password minimal 8 karakter"),
    user: z.number().min(1, "User ID harus diisi"),
  })
  .refine((data) => data.confirm_password === data.password, {
    path: ["confirm_password"],
    message: "Password tidak sesuai",
  });

type changePasswordType = z.infer<typeof changePasswordScheme>;

export const changePasswordHandler = () => {
  const user_id = useSelector((state: RootState) => state.user.user_id);

  const formPassword = useForm<changePasswordType>({
    resolver: zodResolver(changePasswordScheme),
    defaultValues: {
      user: user_id,
    },
  });

  const { control, handleSubmit } = formPassword;

  return { control, handleSubmit, formPassword };
};
