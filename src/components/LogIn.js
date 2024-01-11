"use client";
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";

const Login = () => {
  const router = useRouter();
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogIn = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const accessToken = user.accessToken;

        Cookie.set("MapExplorer", accessToken, {
          expires: 360,
          secure: true,
          sameSite: "strict",
        });
        router.push("/client");
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  return (
    <div>
      login
      <form className="flex flex-col items-center gap-3">
        <input
          value={email}
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          value={password}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="rounded bg-blue-500 hover:bg-blue-600 text-white py-1 px-2"
          onClick={handleLogIn}
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
