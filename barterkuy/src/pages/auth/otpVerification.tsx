import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const otpVerifyScheme = z.object({
  otp: z.string().min(6, "OTP harus memiliki 6 karakter"),
  email: z.string().email("Email tidak valid"),
});

type OtpVerifyScheme = z.infer<typeof otpVerifyScheme>;

function OtpVerification() {
  const location = useLocation();
  const { email } = location.state;

  useEffect(() => {
    console.log(email);
  }, [email]);

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
      alert("OTP verified successfully");
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
      if (data.message === "OTP verified successfully") {
        alert("OTP berhasil dikirim, silahkan cek alamat email anda");
      }
    },
    onError: (error) => {
      console.error(error);
      alert("Gagal mengirim OTP, harap mencoba kembali");
    },
  });

  const handleOtp = () => {
    const formData: FormData = new FormData();
    formData.append("email", email);

    sendOtp.mutate(formData);
  };

  return (
    <>
      <h1>Verification OTP</h1>

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
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
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

          <Button type="submit">Kirim OTP</Button>
        </form>
      </Form>

      <div className="container">
        <Button type="button" onClick={() => handleOtp}>
          Kirim OTP Baru
        </Button>
      </div>
    </>
  );
}

export default OtpVerification;
