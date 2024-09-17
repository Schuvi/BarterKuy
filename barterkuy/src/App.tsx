import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/auth/login";
import Home from "./pages/home";
import Signup from "./pages/auth/signup";
import OtpVerification from "./pages/auth/otpVerification";
import Navbar from "./components/navbar/navbar";

function App() {
  const location = useLocation();

  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/otpVerification"

  return (
    <>
      <div className="wrapper-all">
        <div className="wrapper-content font-fira-sans">
          {!hideNavbar && <Navbar/>}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otpVerification" element={<OtpVerification />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
