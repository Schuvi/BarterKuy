import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { LoginGoogle } from "@/types/type";

function LoginWithGoogle() {
    return (
        <>
            <div className="container mt-5">
                <h1 className="text-center font-bold mb-3">Sign In Dengan : </h1>

                <div className="container p-3 pb-0">
                    <GoogleLogin
                    onSuccess={(credentialResponse) => {
                        const token = credentialResponse.credential;

                        if (token) {
                        const decode = jwtDecode<LoginGoogle>(token);
                        console.log(decode.email);
                        console.log(decode.picture);
                        console.log(decode.name);
                        }
                    }}
                    onError={() => {
                        console.error("login gagal");
                    }}
                    />
                </div>
            </div>
        </>
    )
}

export default LoginWithGoogle