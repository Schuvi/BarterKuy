import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { update } from "@/redux/userSlice";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from "react-router-dom";

const otpVerifyScheme = z.object({
  otp: z.string().min(6, "OTP harus memiliki 6 karakter"),
  email: z.string().email("Email tidak valid"),
});

type OtpVerifyScheme = z.infer<typeof otpVerifyScheme>;

function OtpVerification() {
  const email = useSelector((state: RootState) => state.user.email)
  const pending = useSelector((state: RootState) => state.user.pending)
  const dispatch = useDispatch()

  const MySwal = withReactContent(Swal)
  const Toast = MySwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  })

  const navigate = useNavigate()

  const [countdown, setCountdown] = useState<number>(60)
  let timeout: NodeJS.Timeout

  const displaySeconds = countdown % 60;

  useEffect(() => {
    if (pending === true) {
        timeout = setTimeout(() => {
            setCountdown((state) => state - 1)
        }, 1000)

        if (countdown === 0) {
            dispatch(update({pending: false}))
        }
    } else {
        clearTimeout(timeout)
    }
  }, [pending, countdown]);

  const form = useForm<OtpVerifyScheme>({
    resolver: zodResolver(otpVerifyScheme),
    defaultValues: {
      email: email,
    },
  });

  const { handleSubmit, control } = form;

  const handleSubmitOtp = handleSubmit(async (values) => {
    const formData: FormData = new FormData();
    formData.append("otp", values.otp);
    formData.append("email", values.email);

    console.log("email", values.email);

    const response = await axios.post(import.meta.env.VITE_API_ENDPOINT + "/verify-otp", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response.data.message);

    if (response.data.message === "OTP verified successfully") {
      MySwal.fire({
        icon: "success",
        title: "OTP Berhasil Dikonfirmasi",
      }).then((result) => {
        if (result.isConfirmed) {
            navigate('/')
        }
      });
    }
  });

  const sendOtp = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post(import.meta.env.VITE_API_ENDPOINT + "/otp", formData, {
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
          title: "OTP berhasil dikirim"
        })
      }
    },
    onError: (error) => {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "Gagal Mengirim OTP"
      })
    },
  });

  const handleOtp = (e: any) => {
    e.preventDefault()

    const formData: FormData = new FormData();
    formData.append("email", email);

    dispatch(update({ pending: true }));

    sendOtp.mutate(formData);
  };

  return (
    <>
      <section className="h-[100vh]">
        <div className="container p-2 flex flex-col justify-center h-1/3 bg-color2 rounded-b-3xl">
            <h1 className="text-3xl text-white font-bold">Masukkan Kode</h1>
            <h1 className="text-3xl text-white font-bold mb-3">OTP Untuk Verifikasi</h1>
            <p className="text-white text-[1em]">Klik <strong>Dapatkan OTP</strong> untuk mendapatkan kode OTP yang nantinya akan dikirim ke email anda. Jika belum mendapatkan kode OTP silahkan klik Dapatkan OTP kembali dan tunggu beberapa saat</p>
        </div>

        <div className="container h-1/2 flex flex-col items-center mt-5">
            <Form {...form}>
                <form onSubmit={handleSubmitOtp}>
                    <FormField
                        control={control}
                        name="otp"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <InputOTP maxLength={6} {...field}>
                                <InputOTPGroup>
                                <InputOTPSlot index={0}/>
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                    <InputOTPSeparator />
                                <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <div className="container flex justify-around text-center mt-5">
                        <Button type="submit" className="bg-color2">Kirim OTP</Button>
                        <Button type="button" className="bg-color1" onClick={handleOtp} disabled={pending === false ? false : true}>
                            {pending === false ? "Dapatkan Otp" : `Dapatkan otp kembali dalam ${displaySeconds}`}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>

      </section>

    </>
  );
}

export default OtpVerification;
