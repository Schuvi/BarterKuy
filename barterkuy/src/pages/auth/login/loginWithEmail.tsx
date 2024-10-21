import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "react-router-dom";
import { useState } from "react";
import { loginPostHandler } from "@/services/formPostHandler";

function LoginWithEmail() {
  const [showPassword, setShowPassword] = useState(false);

  const { formLogin, control, handleLogin } = loginPostHandler();
  return (
    <>
      <div className="container mt-3">
        <h1 className="text-center mb-3">Atau</h1>

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
                      <Input {...field} value={field.value || ""} />
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
                      <Input {...field} type={showPassword === false ? "password" : "text"} value={field.value || ""} />
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
              <h1 className="mr-1">Belum memiliki akun?</h1>
              <Link to={"/signup"} className="text-color2">
                Daftar disini!
              </Link>
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
  );
}

export default LoginWithEmail;
