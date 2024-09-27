import LoginHeader from "./loginHeader";
import LoginWithGoogle from "./loginWithGoogle";
import LoginWithEmail from "./loginWithEmail";

function LoginApp() {
  return (
    <>
      <section>
        <LoginHeader />
        <LoginWithGoogle />
        <LoginWithEmail />
      </section>
    </>
  );
}

export default LoginApp;
