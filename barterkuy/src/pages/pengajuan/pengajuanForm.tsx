import { handlePostPengajuan } from "@/services/formPostHandler";
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
import GiveThingsUpImg from "./pengajuanUploadImg";
import { Card } from "@/components/ui/card";

function GiveThingsForm({ kategori, loadingData, errorData }: { kategori: dataKategori[]; loadingData: boolean; errorData: boolean }) {
  const { control, handlePostForm, formPengajuan } = handlePostPengajuan();

  const [selection, setSelection] = useState<string>("");
  const [selectionPenawaran, setSelectionPenawaran] = useState<string>("");

  const dispatch = useDispatch();

  const isDisabled = useSelector((state: RootState) => state.user.disabledLoc);

  return (
    <>
      <section className="px-2 pb-2">
        <Card className="p-2">
          <Form {...formPengajuan}>
            <form onSubmit={handlePostForm}>
              <FormField
                control={control}
                name="user"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input {...field} type="text" className="hidden" placeholder="user id" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={control}
                name="fileImg"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input {...field} type="text" className="hidden" placeholder="file path" value={JSON.stringify(field.value)} />
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
                        <Input {...field} type="text" placeholder="Nama barang" value={field.value || ''} />
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
                    <FormItem className="mt-3">
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
                    <FormItem className="mt-3">
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
                    <FormItem className="mt-3">
                      <FormLabel>Lokasi</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" placeholder="Lokasi barang" disabled={isDisabled === true} />
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
                    <FormItem className="flex items-center mt-2">
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
                    <FormItem className="mt-3">
                      <FormLabel>Jenis Penawaran Barang</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          setSelectionPenawaran(value);
                          field.onChange(value);
                        }}
                        value={selection}
                      >
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

              <GiveThingsUpImg />

              <div className="container text-center">
                <Button type="submit" className="mt-5 bg-color2">
                  Ajukan Barang
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </section>
    </>
  );
}

export default GiveThingsForm;
