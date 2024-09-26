import { LoginHandler } from "@/hooks/formHandler";
import { api } from "@/services/axiosConfig";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "react-router-dom";
import { useState } from "react";

function LoginWithEmail() {
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate()

    const MySwal = withReactContent(Swal)

    const {handleSubmit, formLogin, control} = LoginHandler()

    const handleLogin = handleSubmit(async (values) => {
        const formData: FormData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);

        try {
            const response = await api.post("/login", formData)

            if (response.data.message === "Login success!") {
                MySwal.fire({
                    title: "Sign In sukses",
                    icon: "success",
                    confirmButtonText: "Konfirmasi",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      window.localStorage.setItem("token", response.data.accessToken);
                      navigate("/home");
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
    })

    return(
        <>
            <div className="container">
                <h1 className="text-center mt-3 mb-3">Atau</h1>

                <Form {...formLogin}>
                    <form onSubmit={handleLogin} className="container flex flex-col p-3 pt-0">
                    <FormField
                        control={control}
                        name="email"
                        render={({ field }) => {
                        return (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        );
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
                                <Input type={showPassword === false ? "password" : "text"} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        );
                        }}
                    />

                    <div className="mt-2 flex">
                        <input type="checkbox" id="showpass" className="border mr-2" onClick={() => setShowPassword(!showPassword)} />
                        <label htmlFor="showpass">Tampilkan Password</label>
                    </div>

                    <div className="container flex justify-center mt-5">
                        <h1 className="mr-1">Belum memiliki akun?</h1><Link to={'/signup'} className="text-color2">Daftar disini!</Link>
                    </div>

                    <div className="container text-center mt-2 mb-5">
                        <Button type="submit" className="border p-2 w-[50vw] rounded-lg bg-color2 text-white font-bold active:bg-white">
                        Sign In
                        </Button>
                    </div>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default LoginWithEmail