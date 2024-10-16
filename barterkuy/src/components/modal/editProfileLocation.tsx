import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Form, FormField, FormLabel, FormMessage, FormItem } from "../ui/form";
import { Select, SelectTrigger, SelectItem, SelectContent } from "../ui/select";
import { handleEditLocationProfile } from "@/services/formPostHandler";
import { fetchProv, fetchKot, fetchKec } from "@/hooks/fetchHooks";
import { useState } from "react";
import { stateKota, stateKec, stateProv } from "@/types/type";

function ModalEditProfileLocation({ onClose }: { onClose: () => void }) {
  const { control, formEditLocation, handlePostEditLocation } = handleEditLocationProfile(onClose);

  const [stateKota, setEditStateKota] = useState<stateKota>({
    provId: "",
    trigger: false,
    kotName: "",
  });

  const [stateKec, setEditStateKec] = useState<stateKec>({
    kotId: "",
    trigger: false,
    kecName: "",
  });

  const [stateProv, setStateProv] = useState<stateProv>({
    provName: "",
  });

  const handleFetchQueryKot = (id: string) => {
    setEditStateKota((prevState) => ({
      ...prevState,
      provId: id,
      trigger: true,
    }));
  };

  const handleFetchQueryKec = (id: string) => {
    setEditStateKec((prevState) => ({
      ...prevState,
      kotId: id,
      trigger: true,
    }));
  };

  const { data: prov, isLoading: loadingProv, isError: errorProv } = fetchProv();

  const { data: kot, isLoading: loadingKot, isError: errorKot } = fetchKot(stateKota.provId, stateKota.trigger);

  const { data: kec, isLoading: loadingKec, isError: errorKec } = fetchKec(stateKec.kotId, stateKec.trigger);

  return (
    <>
      <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-25 flex justify-center items-center">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile Location</CardTitle>
            <CardDescription>Ganti lokasi anda dibawah ini</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...formEditLocation}>
              <form onSubmit={handlePostEditLocation}>
                <FormField
                  control={control}
                  name="provinsi"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Provinsi</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const provinsi = prov?.find((item: { id: string; text: string }) => item.text === value);

                            if (provinsi) {
                              handleFetchQueryKot(provinsi.id);
                              setStateProv((prevState) => ({
                                ...prevState,
                                provName: provinsi.text,
                              }));
                              field.onChange(provinsi.text);
                            }
                          }}
                          value={field.value}
                        >
                          <SelectTrigger>{stateProv.provName ? stateProv.provName : "Pilih Provinsi"}</SelectTrigger>
                          <SelectContent>
                            {errorProv
                              ? "Data Provinsi Error"
                              : loadingProv
                              ? "Loading..."
                              : prov?.map((item: { id: string; text: string }) => (
                                  <SelectItem key={item.id} value={item.text}>
                                    {item.text}
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={control}
                  name="kota"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Kota</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const kota = kot?.find((item: { id: string; text: string }) => item.text === value);

                            if (kota) {
                              handleFetchQueryKec(kota.id);
                              setEditStateKota((prevState) => ({
                                ...prevState,
                                kotName: kota.text,
                              }));
                              field.onChange(kota.text);
                            }
                          }}
                          value={field.value}
                        >
                          <SelectTrigger>{stateKota.kotName ? stateKota.kotName : "Pilih Kota"}</SelectTrigger>
                          <SelectContent>
                            {errorKot
                              ? "Data Kota Error"
                              : loadingKot
                              ? "Loading..."
                              : kot?.map((item: { id: string; text: string }) => (
                                  <SelectItem key={item.id} value={item.text}>
                                    {item.text}
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={control}
                  name="kecamatan"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Kecamatan</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const kecamatan = kec?.find((item: { id: string; text: string }) => item.text === value);

                            if (kecamatan) {
                              handleFetchQueryKec(kecamatan.id);
                              setEditStateKec((prevState) => ({
                                ...prevState,
                                kecName: kecamatan.text,
                              }));
                              field.onChange(kecamatan.text);
                            }
                          }}
                          value={field.value}
                        >
                          <SelectTrigger>{stateKec.kecName ? stateKec.kecName : "Pilih Kecamatan"}</SelectTrigger>
                          <SelectContent>
                            {errorKec
                              ? "Data Kecamatan Error"
                              : loadingKec
                              ? "Loading..."
                              : kec?.map((item: { id: string; text: string }) => (
                                  <SelectItem key={item.id} value={item.text}>
                                    {item.text}
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col h-[15vh] justify-between items-center">
            <Button type="button" className="bg-color2" onClick={handlePostEditLocation}>
              Ganti Lokasi
            </Button>

            <Button type="button" className="bg-red-700" onClick={onClose}>
              Tutup
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default ModalEditProfileLocation;
