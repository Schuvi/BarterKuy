import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function EditProfileImgModal({onClose}: {onClose: () => void}) {
    return(
        <>
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Ganti Gambar Profile
                        </CardTitle>
                        <CardDescription>
                            Upload gambar baru yang akan anda gunakan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                    </CardContent>
                </Card>

                <button onClick={onClose}>
                    tutup
                </button>
            </div>
        </>
    )
}

export default EditProfileImgModal