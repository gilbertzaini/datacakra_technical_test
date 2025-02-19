import { Outlet, Navigate } from "react-router-dom";
import useCheckLoggedIn from "./useCheckLoggedIn";

const ProtectedRoutes = () => {
  const isLoggedIn = useCheckLoggedIn();

  return isLoggedIn ? <Outlet /> : <Navigate to={"/login"} />;
};

export default ProtectedRoutes;
