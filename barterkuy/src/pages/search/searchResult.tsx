import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { fetchSearchThings } from "@/hooks/fetchHooks"
import { detailData } from "@/types/type"

function SearchResult() {
    const nama_barang = useSelector((state: RootState) => state.things.searchThings)
    const lokasiSearch = useSelector((state: RootState) => state.things.locationThings)

    const {data: searchValue, isError: error, isLoading: loading} = fetchSearchThings(lokasiSearch, nama_barang)

    if (error) {
        return(
            alert("Gagal mengambil data")
        )
    }

    if (loading) {
        return(
            <div>Loading...</div>
        )
    }

    return(
        <>
            <div className="container">
                {searchValue?.data.map((item: detailData) => (
                    <div key={item.id} className="card">

                    </div>
                ))}
            </div>
        </>
    )
}

export default SearchResult