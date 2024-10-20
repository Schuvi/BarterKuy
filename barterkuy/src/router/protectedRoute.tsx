import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootStatePersist } from "@/redux/redux-persist/store-persist";

function ProtectedRoute() {
    const token = useSelector((state: RootStatePersist) => state.user.token)
    
}