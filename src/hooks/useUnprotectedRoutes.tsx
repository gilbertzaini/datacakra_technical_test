import { Navigate, Outlet } from "react-router-dom";
import useCheckLoggedIn from "./useCheckLoggedIn";

const UnauthorizedRoute = () => {
  const isLoggedIn = useCheckLoggedIn();

  return (
    <>
      {isLoggedIn ? <Navigate to="/" /> : <Outlet />}
    </>
  );
};

export default UnauthorizedRoute;