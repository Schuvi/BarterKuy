import { RouterProvider } from "react-router-dom";
import router from "./router/route";

function App() {
  return (
    <>
      <div className="wrapper-all">
        <div className="wrapper-content font-fira-sans">
          <RouterProvider router={router}/>
        </div>
      </div>
    </>
  );
}

export default App;
