import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProv, fetchKot, fetchKec } from "@/hooks/fetchHooks";
import { useState } from "react";
import { signPostHandler } from "@/services/formPostHandler";

function SignUpForm() {
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

  const { control, formSignUp, handleSignUp } = signPostHandler();

  const { data: prov } = fetchProv();

  const { data: kot } = fetchKot(selectProvinsiId, QueryFetchKab);

  const { data: kec } = fetchKec(selectKabupatenId, QueryFetchKec);

  return (
    <>
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
    </>
  );
}

export default SignUpForm;
