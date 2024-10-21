import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootStatePersist } from "@/redux/redux-persist/store-persist";
import { protectedRouteType } from "@/types/type";

function ProtectedRoute({ children }: protectedRouteType) {
  const token = useSelector((state: RootStatePersist) => state.user.token);

  const isValidJWT = (token: string) => {
    return token.split(".").length === 3;
  };

  if (!isValidJWT(token)) {
    return <Navigate to="/login" />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
