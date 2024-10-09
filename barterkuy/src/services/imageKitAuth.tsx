import { api } from "./axiosConfig"

const imageKitAuthenticator = async () => {
    try {
        const response = await api.get("/get/auth/imagekit")

        if (!response) {
            throw new Error(`Request failed`)
        }

        const { signature, expire, token } = response.data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error}`);
    }
}

export default imageKitAuthenticator