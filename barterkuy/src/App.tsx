import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login";
import Home from "./pages/home";
import Signup from "./pages/auth/signup";

function App() {
  return (
    <>
      <div className="wrapper-all">
        <div className="wrapper-content font-fira-sans">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
