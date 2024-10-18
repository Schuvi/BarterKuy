import { Card, CardContent, CardHeader, CardDescription, CardFooter, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootStatePersist } from "@/redux/redux-persist/store-persist";
import { updateThings } from "@/redux/thingsSlice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProv, fetchKot } from "@/hooks/fetchHooks";
import { searchFilterHandler } from "@/hooks/useForm";
import { Form, FormField } from "../ui/form";
import { useState } from "react";

function SearchFilterModal({ onClose }: { onClose: () => void }) {
  const provinsi = useSelector((state: RootStatePersist) => state.things.provinceThings);
  const [isProvinsi, setIsProvinsi] = useState<boolean>(true);
  const [placeholder, setPlaceHolder] = useState<string>("Pilih Provinsi Terlebih Dahulu");
  const [fetchKab, setFetchKab] = useState<boolean>(false);

  const dispatch = useDispatch();

  const { handleSubmit, control, formSearchFilter } = searchFilterHandler();

  const { data: prov, isLoading: loadingProv } = fetchProv();
  const { data: kab, isLoading: loadingKab } = fetchKot(provinsi, fetchKab);

  const handleFilter = handleSubmit((values) => {
    const kabupaten = values.kabupaten.replace("Kota", "").trim();

    dispatch(updateThings({ kabupatenThings: kabupaten }));

    onClose();
  });

  const handleSelectProv = (provinsi: string) => {
    setFetchKab(true);
    dispatch(updateThings({ provinceThings: provinsi }));
    if (isProvinsi === true) {
      setIsProvinsi(!isProvinsi);
      setPlaceHolder("Pilih Kabupaten");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-md flex justify-center items-center">
        <Card>
          <CardHeader>
            <CardTitle>Search Filter</CardTitle>
            <CardDescription>Pilih lokasi untuk menerapkan filter</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...formSearchFilter}>
              <form onSubmit={handleFilter} className="flex flex-col gap-4">
                <FormField
                  control={control}
                  name="provinsi"
                  render={({ field }) => {
                    return (
                      <Select
                        onValueChange={(value) => {
                          const provinsi = prov?.find((item: { id: string; text: string }) => item.id === value);
                          if (provinsi) {
                            handleSelectProv(provinsi.id);
                            field.onChange(provinsi.id);
                          }
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Provinsi" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingProv
                            ? "Loading.."
                            : prov?.map((item: { id: string; text: string }) => (
                                <SelectItem key={item.id} value={item.id}>
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
                  name="kabupaten"
                  render={({ field }) => {
                    return (
                      <Select onValueChange={field.onChange} value={field.value} disabled={isProvinsi}>
                        <SelectTrigger>
                          <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingKab
                            ? "Loading.."
                            : kab?.map((item: { id: string; text: string }) => (
                                <SelectItem key={item.id} value={item.text}>
                                  {item.text}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="button" onClick={handleFilter} className="bg-color2">
              Terapkan Filter
            </Button>
            <Button onClick={onClose} className="text-white bg-red-500">
              Tutup
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SearchFilterModal;
