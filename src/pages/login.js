import Auth from "@/components/Auth";
import Login from "@/components/LogIn";
import React from "react";

const login = () => {
  return (
    <>
      <div className="w-full h-screen flex flex-col items-center  gap-3 bg-emerald-700">
        <div>
          <Auth />
        </div>
        <div>
          <Login />
        </div>
      </div>
    </>
  );
};

export default login;
