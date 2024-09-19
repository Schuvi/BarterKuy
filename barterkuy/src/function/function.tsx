import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const usePosts = () => {
    const location = useSelector((state: RootState) => state.user.kabupaten)

    const fetchPosts = async (location: string) => {
        const response = await axios.get(import.meta.env.VITE_API_ENDPOINT + `/posts`, {
            params: {
                lokasi: location
            }
        })

        return response.data
    }

    return useQuery({
        queryKey: ['posts', location],
        queryFn: async ({queryKey}) => fetchPosts(queryKey[1] as string),
        retry: 2,
        refetchInterval: 60000
    })
}

export const fetchKabupaten = (provinsi: string) => {
    console.log(provinsi)
    
    const reqKab = async () => {
        const response = await axios.get(import.meta.env.VITE_API_ENDPOINT + '/kabupaten', {
            params: {
                prov: provinsi
            }
        })
    
        return response.data
    }

    return useQuery({
        queryKey: ['kabupaten'],
        queryFn: reqKab,
        retry: 2,
        refetchInterval: false
    })
    
}