import SignUpHeader from "./signUpHeader"
import SignUpForm from "./signUpForm"

function SignUpPage() {
    return(
        <>
            <section className="flex flex-col items-center">
                <SignUpHeader/>
                <SignUpForm/>
            </section>
        </>
    )
}

export default SignUpPage