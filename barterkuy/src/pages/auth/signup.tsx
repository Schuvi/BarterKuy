import axios from "axios";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProv, fetchKot, fetchKec } from "@/hooks/fetchHooks";
import { useState } from "react";
import { IKImage } from "imagekitio-react";
import { useDispatch } from "react-redux";
import { update } from "@/redux/userSlice";
import { signUpHandler } from "@/hooks/formHandler";

function Signup() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { handleSubmit, control, formSignUp } = signUpHandler();

  const [selectProvinsiId, setSelectProvinsiId] = useState<string>("");
  const [selectKabupatenId, setSelectKabupatenId] = useState<string>("");
  const [QueryFetchKab, setQueryFetchKab] = useState<boolean>(false);
  const [QueryFetchKec, setQueryFetchKec] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(false);

  const handleSelectionKab = (id: string) => {
    setSelectProvinsiId(id);
    setQueryFetchKab(true);
  };

  const handleSelectionKec = (id: string) => {
    setSelectKabupatenId(id);
    setQueryFetchKec(true);
  };

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

    const response = await axios.post(import.meta.env.VITE_API_ENDPOINT + "/register", formData, {
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

  const { data: prov } = fetchProv();

  const { data: kot } = fetchKot(selectProvinsiId, QueryFetchKab);

  const { data: kec } = fetchKec(selectKabupatenId, QueryFetchKec);

  return (
    <>
      <section className="flex flex-col items-center h-[100vh]">
        <div className="container flex flex-col justify-center items-center text-center mb-5">
          <div className="container flex justify-center w-[40vw] mt-5">
            <IKImage
              urlEndpoint={import.meta.env.VITE_IMAGEKIT_PUBLIC_URL_ENDPOINT}
              path="barterkuy.png"
              transformation={[
                {
                  quality: "100",
                  width: "300",
                  height: "340",
                  cropMode: "extract",
                },
              ]}
              className="h-full"
            />
          </div>

          <h1 className="text-2xl font-bold">Sign Up BarterKuy!</h1>
        </div>

        <div className="container">
          <Form {...formSignUp}>
            <form onSubmit={handleSignUp} className="p-2 flex flex-col justify-around">
              <div className="container flex justify-between mb-2">
                <FormField
                  control={control}
                  name="nama_lengkap"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Input {...field} className="p-3 rounded-2xl w-[45vw]" placeholder="Nama Lengkap" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Input {...field} className="p-3 rounded-2xl w-[45vw]" placeholder="Email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <FormField
                control={control}
                name="nomor_telepon"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className="p-3 rounded-2xl mb-2" placeholder="Nomor Telepon" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={control}
                name="role"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className="p-3 rounded-2xl mb-2 hidden" disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={control}
                name="provinsi"
                render={({ field }) => {
                  return (
                    <Select
                      onValueChange={(value) => {
                        const provinsi = prov?.find((item: { id: string; text: string }) => item.text === value);
                        console.log(provinsi);
                        if (provinsi) {
                          handleSelectionKab(provinsi.id);
                          field.onChange(provinsi.text);
                        }
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="rounded-2xl mb-2">
                        <SelectValue placeholder="Provinsi" />
                      </SelectTrigger>
                      <SelectContent>
                        {prov?.map((item: { id: string; text: string }) => (
                          <SelectItem key={item.id} value={item.text}>
                            {item.text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />

              <FormField
                control={control}
                name="kota"
                render={({ field }) => {
                  return (
                    <Select
                      onValueChange={(value) => {
                        const kota = kot?.find((item: { id: string; text: string }) => item.text === value);
                        console.log(kota);
                        if (kota) {
                          handleSelectionKec(kota.id);
                          field.onChange(kota.text);
                        }
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="rounded-2xl mb-2">
                        <SelectValue placeholder="Kota" />
                      </SelectTrigger>
                      <SelectContent>
                        {kot?.map((item: { id: string; text: string }) => (
                          <SelectItem key={item.id} value={item.text}>
                            {item.text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />

              <FormField
                control={control}
                name="kecamatan"
                render={({ field }) => {
                  return (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="rounded-2xl mb-2">
                        <SelectValue placeholder="Kecamatan" />
                      </SelectTrigger>
                      <SelectContent>
                        {kec?.map((item: { id: string; text: string }) => (
                          <SelectItem key={item.id} value={item.text}>
                            {item.text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />

              <FormField
                control={control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type={showPass === false ? "password" : "text"} {...field} className="p-3 rounded-2xl mb-2" placeholder="Password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={control}
                name="password2"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type={showPass === false ? "password" : "text"} {...field} className="p-3 rounded-2xl mb-2" placeholder="Konfirmasi Password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="container flex ml-2">
                <input className="mr-2" id="showpass" type="checkbox" onClick={() => setShowPass(!showPass)} />
                <label htmlFor="showpass">Tampilkan Password</label>
              </div>

              <div className="text-center mt-4">
                <Button type="submit" className="w-1/2 bg-color2">
                  Sign Up
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </>
  );
}

export default Signup;
