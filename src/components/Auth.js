import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const Auth = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(null);
  const auth = getAuth();
  const router = useRouter();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if (isMobileDevice()) {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        await processSignInResult(result);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const processSignInResult = async (result) => {
    const { uid, email } = result.user;

    const clientsCollection = collection(getFirestore(), "clients");
    const userDoc = doc(clientsCollection, uid);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      await setDoc(userDoc, { uid, email });
    }

    const accessToken = result.user.accessToken;
    Cookie.set("MapExplorer", accessToken, {
      expires: 360,
      secure: true,
      sameSite: "strict",
    });

    router.push("/client");
  };

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          await processSignInResult(result);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    if (isMobileDevice()) {
      checkRedirectResult();
    }

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setLoggedIn(authUser);
      } else {
        setLoggedIn(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <div>
      <h1 className="text-3xl text-white mb-20">Please Sign In</h1>
      <button
        className="rounded bg-[#50d71e] hover:bg-blue-600 text-white py-2 px-4"
        onClick={signInWithGoogle}
      >
        Sign In with Google
      </button>
      {children}
    </div>
  );
};

export default Auth;
