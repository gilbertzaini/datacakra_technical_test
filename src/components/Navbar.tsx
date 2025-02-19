import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCheckLoggedIn from "@/hooks/useCheckLoggedIn"; // Adjust the path if needed

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = useCheckLoggedIn();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("email");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="h-[8vh] w-full bg-[#0a0a0a] shadow-md fixed top-0 z-50 flex items-center justify-between px-5 lg:px-15">
      <button onClick={() => navigate("/")} className="font-bold text-xl lg:text-2xl text-white">
        Travel Article App
      </button>

      <div className="flex gap-5 text-sm text-slate-50">
        <button onClick={() => navigate("/")}>Articles</button>

        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
