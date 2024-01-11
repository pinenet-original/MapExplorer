import Auth from "@/components/Auth";
import SingIn from "@/components/SingIn";
import React from "react";

const register = () => {
  return (
    <>
      <div className="w-full h-screen flex flex-col items-center  gap-3 bg-emerald-700">
        <div>
          <Auth />
        </div>
        <div>
          <SingIn />
        </div>
      </div>
    </>
  );
};

export default register;
