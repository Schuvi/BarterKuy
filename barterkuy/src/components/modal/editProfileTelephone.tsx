import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { handleEditTelephoneProfile } from "@/services/formPostHandler";

function ModalEditProfileTelephone({ onClose }: { onClose: () => void }) {
  const { control, formEditTelephone, handlePostEditTelephone } = handleEditTelephoneProfile(onClose);

  return (
    <>
      <div className="container inset-0 fixed bg-black backdrop-blur-sm bg-opacity-25 flex flex-col justify-center items-center">
        <Card className="p-2">
          <CardHeader>
            <CardTitle>Ganti Nomor Telepon Anda</CardTitle>
            <CardDescription>Masukkan nama anda pada kotak dibawah ini!</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...formEditTelephone}>
              <form onSubmit={handlePostEditTelephone}>
                <FormField
                  control={control}
                  name="user"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="user id" className="hidden" />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={control}
                  name="nomor_telepon"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Nomor telepon</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nomor telepon" value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="container h-[10vh] flex flex-col items-center justify-between">
              <Button type="button" className="w-[40vw] bg-color2" onClick={handlePostEditTelephone}>
                Ganti Nomor Telepon
              </Button>

              <Button type="button" className="w-[20vw] bg-red-700" onClick={onClose}>
                Tutup
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default ModalEditProfileTelephone;
