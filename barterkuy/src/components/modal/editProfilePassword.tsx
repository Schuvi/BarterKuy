import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Form, FormField, FormLabel, FormMessage, FormItem, FormControl } from "../ui/form";
import { Input } from "../ui/input";
import { handlePostChangePassword } from "@/services/formPostHandler";

function ModalEditProfilePassword({onClose}: {onClose: () => void}) {
    const {control, formPassword, handleChangePassword} = handlePostChangePassword(onClose)
    
    return(
        <>
            <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-25 flex justify-center items-center">
                <Card>
                    <CardHeader>
                        <CardTitle>Ganti Password</CardTitle>
                        <CardDescription>
                            Isi form dibawah untuk mengganti password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...formPassword}>
                            <form onSubmit={handleChangePassword}>
                                <FormField
                                    control={control}
                                    name="old_password"
                                    render={({field}) => {
                                        return(
                                            <FormItem>
                                                <FormLabel>
                                                    Password Lama
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Masukkan password lama" value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                                
                                <FormField
                                    control={control}
                                    name="password"
                                    render={({field}) => {
                                        return(
                                            <FormItem className="mt-3">
                                                <FormLabel>
                                                    Password Baru
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Masukkan password baru" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                                
                                <FormField
                                    control={control}
                                    name="confirm_password"
                                    render={({field}) => {
                                        return(
                                            <FormItem className="mt-3">
                                                <FormLabel>
                                                    Konfirmasi Password
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Konfirmasi password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="text-center flex flex-col justify-between h-[15vh]">
                        <Button type="button" className="bg-color2" onClick={handleChangePassword}>
                            Ganti Password
                        </Button>
                        <Button type="button" className="bg-red-700" onClick={onClose}>
                            Tutup
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default ModalEditProfilePassword