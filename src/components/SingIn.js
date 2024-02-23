import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import Form from "./Form";
import Cookie from "js-cookie";

const SingIn = () => {
  const router = useRouter();
  const [userExists, setUserExists] = useState(false);

  const handleRegister = async (email, password) => {
    const auth = getAuth();
    const firestore = getFirestore();

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const clientsRef = collection(firestore, "clients");
      const q = query(
        clientsRef,
        where("email", "==", email),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const docRef = doc(firestore, "clients", user.uid);
        await setDoc(docRef, { email, uid: user.uid, routes: [] });
        const accessToken = user.accessToken;
        Cookie.set("MapExplorer", accessToken, {
          expires: 360,
          secure: true,
          sameSite: "strict",
        });

        router.push("/client");
      } else {
      }
    } catch (error) {
      setUserExists(true);
      console.log("User already exists in 'clients' collection");
      console.error(error);
    }
  };

  return (
    <div>
      <Form handleClick={handleRegister} button="Register" />

      {userExists && (
        <p>This user email already exists. Please choose another one.</p>
      )}
    </div>
  );
};

export default SingIn;
