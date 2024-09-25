import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea"
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState } from "react";

const laporPenggunaForm = z.object({
    alasan: z.string().min(1, "Pilih minimal 1 alasan"),
    penjelasan: z.string().min(30, "Minimal penjelasan adalah 30 karakter").max(200, "Penjelasan maksimal adalah 200 karakter"),
    target_id: z.number().min(1, "Masukkan user id target"),
    user_id: z.number().min(1, "Masukkan user id pengguna")
})

type formLaporPengguna = z.infer<typeof laporPenggunaForm>

interface laporanPenggunaProps {
    onClose: () => void,
    id: number
}

function LaporPengguna({ onClose, id }: laporanPenggunaProps) {
    const user = useSelector((state: RootState) => state.user.user_id)

    const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false)
    const [showFailedAlert, setShowFailedAlert] = useState<boolean>(false)

    useEffect(() => {
        let timer: any
        if (showSuccessAlert === true) {
            timer = setTimeout(() => {
                setShowSuccessAlert(false)
                onClose()
            }, 3000)

        } else if (showFailedAlert === true) {
            timer = setTimeout(() => {
                setShowFailedAlert(false)
                onClose()
            }, 3000)
        }

        return () => {
            clearTimeout(timer)
        }
    }, [showSuccessAlert, showFailedAlert])

    const form = useForm<formLaporPengguna>({
        resolver: zodResolver(laporPenggunaForm),
        defaultValues: {
            target_id: id,
            user_id: user
        }
    })

    const {handleSubmit, control} = form

    const handleLaporan = handleSubmit(async (values) => {
        const formData: FormData = new FormData()
        formData.append('target_id', values.target_id.toString())
        formData.append('reporter_id', values.user_id.toString())
        formData.append('alasan', values.alasan)
        formData.append('isi_laporan', values.penjelasan)

        console.log(formData.get('reporter_id'))
        
        const response = await axios.post(import.meta.env.VITE_API_ENDPOINT + '/laporkan', formData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (response.data.statusCode === 200) {
            setShowSuccessAlert(true)
        } else {
            setShowFailedAlert(true)
        }
    })
    
    return(
        <>
            <section className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
                <Card>
                    <CardHeader>
                        <CardTitle>Laporkan Pengguna</CardTitle>
                        <CardDescription>
                            Laporkan pengguna yang melakukan kesalahan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={handleLaporan}>
                                <FormField 
                                    control={control}
                                    name="alasan"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Alasan</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih Alasan" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="penipuan">
                                                            Penipuan
                                                        </SelectItem>
                                                        <SelectItem value="aktivitas ilegal">
                                                            Aktivitas Ilegal
                                                        </SelectItem>
                                                        <SelectItem value="perilaku mencurigakan">
                                                            Perilaku Mencurigakan
                                                        </SelectItem>
                                                        <SelectItem value="alasan lain">
                                                            Alasan Lain
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}
                                />

                                <FormField 
                                    control={control}
                                    name="penjelasan"
                                    render={({ field }) => {
                                        return(
                                            <FormItem>
                                                <FormLabel>Jelaskan :</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Jelaskan alasanmu" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}
                                />

                                <FormField 
                                    control={control}
                                    name="target_id"
                                    render={({ field }) => {
                                        return(
                                            <FormItem>
                                                <FormControl>
                                                    <Input className="hidden" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}
                                />

                                <FormField 
                                    control={control}
                                    name="user_id"
                                    render={({ field }) => {
                                        return(
                                            <FormItem>
                                                <FormControl>
                                                    <Input className="hidden" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}
                                />
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter>
                        <div className="container text-center flex justify-around">
                            <Button className="bg-red-600" type="button" onClick={handleLaporan}>Laporkan</Button>

                            <Button type="button" onClick={() => onClose()}>Batal</Button>
                        </div>
                    </CardFooter>
                </Card>

                {showSuccessAlert && 
                    <div className="p-2">
                        <Alert>
                            <AlertTitle className="text-lg text-color2">
                                Berhasil melaporkan pengguna
                            </AlertTitle>
                            <AlertDescription>
                                Terimakasih atas tanggapan anda, pengguna akan segera kami tindak
                            </AlertDescription>
                        </Alert>
                    </div>
                }

                {showFailedAlert && 
                    <div className="p-2">
                        <Alert>
                            <AlertTitle className="text-lg text-red-600">
                                Gagal melaporkan pengguna
                            </AlertTitle>
                            <AlertDescription>
                                Maaf, laporan anda gagal harap coba sesaat lagi
                            </AlertDescription>
                        </Alert>
                    </div>
                }
            </section>
        </>
    )
}

export default LaporPengguna