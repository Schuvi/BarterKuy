function OtpVerifHeader() {
    return(
        <>
            <div className="container p-2 flex flex-col justify-center h-1/3 bg-color2 rounded-b-3xl">
                <h1 className="text-3xl text-white font-bold">Masukkan Kode</h1>
                <h1 className="text-3xl text-white font-bold mb-3">OTP Untuk Verifikasi</h1>
                <p className="text-white text-[1em]">Klik <strong>Dapatkan OTP</strong> untuk mendapatkan kode OTP yang nantinya akan dikirim ke email anda. Jika belum mendapatkan kode OTP silahkan klik Dapatkan OTP kembali dan tunggu beberapa saat</p>
            </div>
        </>
    )
}

export default OtpVerifHeader