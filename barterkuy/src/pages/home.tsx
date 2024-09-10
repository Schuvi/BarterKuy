import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Home() {
    const navigate = useNavigate()

    const logout = useMutation({
        mutationFn: async () => {
            const response = await axios.post(import.meta.env.VITE_API_ENDPOINT + '/logout', {} , {
                headers: {
                    'Authorization' : `Bearer ${window.localStorage.getItem('token')}`
                }
            })

            return response.data
        },
        onSuccess: (data) => {
            if (data.message === "Logout succesful") {
                window.localStorage.removeItem('token')
                navigate('/login')
            }
        }
    })

    const handleLogout = () => {
        logout.mutate()
    }
    
    return(
        <>
            <h1>Beranda</h1>

            <button onClick={() => handleLogout()}>
                logout
            </button>
        </>
    )
}

export default Home