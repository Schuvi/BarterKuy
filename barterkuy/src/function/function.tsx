import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const fetchPosts = async () => {
    const response = await axios.get(import.meta.env.VITE_API_ENDPOINT + '/posts')

    return response.data
}

export const usePosts = () => {
    return useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        retry: 2,
        refetchInterval: 60000
    })
}