import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";

const Header = () => {
  const router = useRouter();
  const [logedIn, setLogedIn] = useState(null);
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Cookie.remove("MapExplorer");
    } catch (error) {
      console.error(error.message);
    }
    router.push("/");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (logedIn) => {
      if (logedIn) {
        setLogedIn(logedIn);
      } else {
        setLogedIn(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="flex justify-between px-5  bg-emerald-700">
      <Link href="/">MapExplorer</Link>
      <Link href="/client">Client</Link>
      <div>
        {logedIn ? (
          <>
            <button
              className="rounded bg-blue-500 hover:bg-blue-600 text-white py-1 px-2"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </>
        ) : (
          <div className="borer-2 w-[150px] flex justify-between">
            <button className=" rounded bg-[#50d71e] hover:bg-blue-600 text-white py-0 px-2">
              <Link href="/login">Log in</Link>
            </button>
            <button className=" rounded bg-[#50d71e] hover:bg-blue-600 text-white py-0 px-2">
              <Link href="/register">Register</Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
