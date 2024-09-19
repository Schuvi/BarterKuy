import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { update } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchKabupaten } from "@/function/function";

interface LocationFilterProps {
  onClose: () => void;
}

const locationFilter = z.object({
  kabupaten: z.string().min(1, "Pilih minimal 1 kota"),
});

type filterLocationType = z.infer<typeof locationFilter>;

function LocationFilter({ onClose }: LocationFilterProps) {
  const location = useSelector((state: RootState) => state.user.kabupaten);
  const provinsi = useSelector((state: RootState) => state.user.provinsi);
  const { data: kab } = fetchKabupaten(provinsi);

  const form = useForm<filterLocationType>({
    resolver: zodResolver(locationFilter),
    defaultValues: {
      kabupaten: location,
    },
  });

  const dispatch = useDispatch();

  const { handleSubmit, control } = form;

  const handleFilter = handleSubmit((values) => {
    const kabupaten = values.kabupaten.replace("Kota", "").replace("Kabupaten", "").trim();

    dispatch(update({ kabupaten: kabupaten }));
    onClose();
  });

  return (
    <>
      <section className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
        <Card>
          <CardHeader>
            <CardTitle>Filter Lokasi</CardTitle>
            <CardDescription>Pilih lokasi untuk filter barang berdasarkan lokasi</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFilter}>
                <FormField
                  control={control}
                  name="kabupaten"
                  render={({ field }) => {
                    return (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Kabupaten / Kota" />
                        </SelectTrigger>
                        <SelectContent>
                          {kab?.data.map((item: { id: string; text: string }) => (
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
          <CardFooter className="flex justify-around">
            <Button type="button" onClick={handleFilter}>
              Submit
            </Button>
            <Button type="button" className="bg-red-600" onClick={() => onClose()}>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}

export default LocationFilter;
