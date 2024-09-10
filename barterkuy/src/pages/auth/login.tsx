import { GoogleLogin } from "@react-oauth/google";
import { IKImage } from "imagekitio-react";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage  } from '@/components/ui/form'

interface LoginWithGoogle {
  email?: string;
  name?: string;
  picture?: string;
}

const loginFormSchema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(7, 'Password minimal harus 7 karakter')
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate()

  const MySwal = withReactContent(Swal)

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  })

  const { handleSubmit, control } = form;

  const handleLogin = handleSubmit(async (values) => {
    const formData: FormData = new FormData()
    formData.append('email', values.email)
    formData.append('password', values.password)

    const response = await axios.post(import.meta.env.VITE_API_ENDPOINT + '/login', formData, {
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if (response.data.message === "Login success!") {
        MySwal.fire({
            title: 'Sign In sukses',
            icon: 'success',
            confirmButtonText: 'Konfirmasi'
        }).then((result) => {
            if (result.isConfirmed) {
                window.localStorage.setItem('token', response.data.accessToken)
                navigate('/home')
            }
        })
    }
  })

  return (
    <>
      <section>
        <div className="flex justify-center">
          <IKImage
            urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
            path="3R.png"
            transformation={[
              {
                quality: "10",
              },
            ]}
            className="w-[90vw]"
          />
        </div>

        <h1 className="font-bold text-center text-xl">Barang Baru, Cara Lama</h1>

        <div className="container flex flex-col mt-5 items-center">
          <h1 className="font-bold mb-3">Sign In Dengan : </h1>

          <div className="container p-3 pb-0">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const token = credentialResponse.credential;

                if (token) {
                  const decode = jwtDecode<LoginWithGoogle>(token);
                  console.log(decode.email);
                  console.log(decode.picture);
                  console.log(decode.name);
                }
              }}
              onError={() => {
                console.error("login gagal");
              }}
            />
          </div>

          <h1 className="mt-3 mb-3">Atau</h1>

          <Form {...form}>
            <form onSubmit={handleLogin} className="container flex flex-col p-3 pt-0">
                <FormField
                    control={control}
                    name="email"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}
                />

                <FormField
                    control={control}
                    name="password"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type={showPassword === false ? "password" : "text"} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}
                />

                <div className="mt-2 flex">
                    <input type="checkbox" id="showpass" className="border mr-2" onClick={() => setShowPassword(!showPassword)} />
                    <label htmlFor="showpass">Tampilkan Password</label>
                </div>

                <div className="container text-center mt-5 mb-5">
                    <Button type="submit" className="border p-2 w-[50vw] rounded-lg bg-color2 text-white font-bold active:bg-white">Sign In</Button>
                </div>
            </form>
          </Form>

        </div>
      </section>
    </>
  );
}

export default Login;
