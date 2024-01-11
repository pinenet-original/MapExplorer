import React, { useEffect, useState } from "react";
import { getClients } from "@/utils/dataGetters";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import IndexLayout from "@/layouts/IndexLayout";

const client = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [route, setRoute] = useState([]);

  const updateCollection = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "clients", userInfo.uid);
    await updateDoc(docRef, {
      route: route,
      name: "Goga",
    });
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserInfo(user);
      } else {
        setUserInfo(null);
      }
    });
  }, []);

  useEffect(() => {
    if (!userInfo) return;
    const fetchData = async () => {
      const docRef = doc(db, "clients", userInfo.uid);
      try {
        const docSnap = await getDoc(docRef);
        // client wich is loged in web, firebase collection info
        console.log(11, docSnap.data());
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [userInfo]);

  return (
    <IndexLayout>
      <div className="w-full h-screen flex flex-col items-center  gap-3 bg-emerald-700">
        <div className="mb-16">
          <h1 className="text-3xl">Blank Client page</h1>
        </div>
        <div>
          <p>Here will be come content for Client</p>
        </div>
        <div>
          <div className="mb-5">
            <h1 className="mb-5"> Edit Client Info</h1>
            <p className="text-white">Client UID: {userInfo && userInfo.uid}</p>
            <p className="text-white">
              Client Email: {userInfo && userInfo.email}
            </p>
          </div>
          <form>
            <input
              type="text"
              placeholder="Route"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="mb-5"
            />
            <div>
              <button
                className="rounded bg-blue-500 hover:bg-blue-600 text-white py-1 px-2"
                onClick={updateCollection}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </IndexLayout>
  );
};

export default client;
