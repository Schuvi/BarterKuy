import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { OtpReqHandler } from "@/services/formPostHandler";
import { OtpPostVerify } from "@/services/formPostHandler";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { update } from "@/redux/userSlice";
import { RootState } from "@/redux/store";

function OtpVerifForm() {
    const pending = useSelector((state: RootState) => state.user.pending)
    const email = useSelector((state: RootState) => state.user.email)
    const dispatch = useDispatch()

    const [countdown, setCountdown] = useState<number>(60)
    let timeout: NodeJS.Timeout

    const displaySeconds = countdown % 60;

    useEffect(() => {
        if (pending === true) {
            timeout = setTimeout(() => {
                setCountdown((state) => state - 1)
            }, 1000)

            if (countdown === 0) {
                dispatch(update({pending: false}))
            }
        } else {
            clearTimeout(timeout)
        }
    }, [pending, countdown]);

    const {handleOtp} = OtpReqHandler(email)

    const {handleSubmitOtp, formOtp, control} = OtpPostVerify(email)

    return(
        <>
            <div className="container h-1/2 flex flex-col items-center mt-5">
                <Form {...formOtp}>
                    <form onSubmit={handleSubmitOtp}>
                        <FormField
                            control={control}
                            name="otp"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup>
                                    <InputOTPSlot index={0}/>
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                        <InputOTPSeparator />
                                    <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <div className="container flex flex-col justify-around text-center mt-5">
                            <Button type="submit" className="bg-color2">Kirim OTP</Button>
                            <Button type="button" className="bg-color1 mt-3" onClick={handleOtp} disabled={pending === false ? false : true}>
                                {pending === false ? "Dapatkan Otp" : `Dapatkan otp kembali dalam ${displaySeconds}`}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default OtpVerifForm