import { Card, CardContent, CardHeader, CardDescription, CardFooter, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { useDispatch, useSelector } from "react-redux"
import { updateThings } from "@/redux/thingsSlice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react"
import { fetchKabupaten } from "@/hooks/fetchHooks";
import { RootState } from "@/redux/store"
import { fetchProv } from "@/hooks/fetchHooks";
import { Checkbox } from "../ui/checkbox";
import { searchFilterHandler } from "@/hooks/useForm";
import { Form, FormField } from "../ui/form";

function SearchFilterModal({onClose}: {onClose: () => void}) {
    const [valueFilter, setValueFilter] = useState<string>("")
    const provinsi = useSelector((state: RootState) => state.things.provinceThings)

    const dispatch = useDispatch()

    const {handleSubmit, control, formSearchFilter} = searchFilterHandler()

    const { data: kab, isLoading: loadingKab } = fetchKabupaten(provinsi);
    const { data: prov, isLoading: loadingProv } = fetchProv()

    const handleFilter = handleSubmit({
        
    })

    if (loadingKab) {
        return(
            <h1>Loading....</h1>
        )
    }

    if (loadingProv) {
        return(
            <h1>Loading....</h1>
        )
    }

    return(
        <>
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-md flex justify-center items-center">
                <Button onClick={onClose} className="text-white">Tutup</Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Search Filter</CardTitle>
                        <CardDescription>Pilih lokasi untuk menerapkan filter</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...formSearchFilter}>
                            <form >
                                
                                <Select onValueChange={(value) => setValueFilter(value)} value={valueFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Lokasi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kab?.data.map((item:{ id: string; text: string }) => (
                                            <SelectItem key={item.id} value={item.text}>
                                                {item.text}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                
            </div>
        </>
    )
}

export default SearchFilterModal