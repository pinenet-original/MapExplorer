import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import Cookie from "js-cookie";

const Auth = ({ children }) => {
  const [logedIn, setLogedIn] = useState(null);
  const auth = getAuth();
  const router = useRouter();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { uid, email } = result.user;

      const clientsCollection = collection(getFirestore(), "clients");
      const userDoc = doc(clientsCollection, uid);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        await setDoc(userDoc, { uid, email });
      }

      const user = result.user;
      const accessToken = user.accessToken;

      Cookie.set("MapExplorer", accessToken, {
        expires: 360,
        secure: true,
        sameSite: "strict",
      });

      router.push("/client");
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setLogedIn(authUser);
      } else {
        setLogedIn(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <div>
      <h1 className="text-3xl text-white mb-20">Please Sign In</h1>
      <button
        className=" rounded bg-[#50d71e] hover:bg-blue-600 text-white py-0 px-2"
        onClick={signInWithGoogle}
      >
        Sign In with Google
      </button>

      {children}
    </div>
  );
};

export default Auth;
