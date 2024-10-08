import { formPengajuanHandler } from "@/hooks/useForm";
import { Form, FormField, FormMessage, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectItem, SelectContent } from "@/components/ui/select";
import { dataKategori } from "@/types/type";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { update } from "@/redux/userSlice";
import { RootState } from "@/redux/store";

function GiveThingsForm({ kategori, loadingData, errorData }: { kategori: dataKategori[]; loadingData: boolean; errorData: boolean }) {
  const { handleSubmit, control, formPengajuan } = formPengajuanHandler();

  const [selection, setSelection] = useState<string>("");
  const [selectionPenawaran, setSelectionPenawaran] = useState<string>("");

  const dispatch = useDispatch();

  const isDisabled = useSelector((state: RootState) => state.user.disabledLoc);

  const location = useSelector((state: RootState) => state.user.kabupaten);

  const handlePostForm = handleSubmit((value) => {
    console.log(value);
  });

  return (
    <>
      <Form {...formPengajuan}>
        <form onSubmit={handlePostForm}>
          <FormField
            control={control}
            name="user"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="text" placeholder="user id" className="hidden" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={control}
            name="nama_barang"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Nama Barang</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Nama barang" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={control}
            name="deskripsi_barang"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Deskripsi Barang</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Deskripsi barang" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={control}
            name="kategori_barang"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Kategori Barang</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const newKategori = kategori?.find((item: dataKategori) => item.kategori === value);

                      if (newKategori) {
                        field.onChange(newKategori.kategori_id);
                        setSelection(newKategori.kategori);
                      }
                    }}
                    value={selection}
                  >
                    <SelectTrigger>{selection ? selection : "Pilih kategori barang"}</SelectTrigger>
                    <SelectContent>
                      {errorData
                        ? "Data Error"
                        : loadingData
                        ? "Loading..."
                        : kategori?.map((item: dataKategori) => (
                            <SelectItem key={item.kategori_id} value={item.kategori}>
                              {item.kategori}
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
            name="lokasi"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Lokasi</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Lokasi barang" value={isDisabled ? location : field.value} disabled={isDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={control}
            name="locNow"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center">
                  <FormControl className="mt-1">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => {
                        if (value === true) {
                          dispatch(update({ disabledLoc: true }));
                        } else {
                          dispatch(update({ disabledLoc: false }));
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="ml-2">Gunakan lokasi login anda</FormLabel>
                </FormItem>
              );
            }}
          />

          <FormField
            control={control}
            name="jenis_penawaran"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Jenis Penawaran Barang</FormLabel>
                  <Select onValueChange={(value) => {
                    setSelectionPenawaran(value)
                    field.onChange(value)
                  }} value={selection}>
                    <SelectTrigger>{selectionPenawaran ? selectionPenawaran : "Pilih Jenis Penawaran"}</SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Barter">Barter</SelectItem>
                      <SelectItem value="Gratis">Gratis</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </form>
      </Form>
    </>
  );
}

export default GiveThingsForm;
