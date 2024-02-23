import React, { useEffect, useState } from "react";
import { getClients } from "@/utils/dataGetters";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, updateDoc, docSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import IndexLayout from "@/layouts/IndexLayout";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import EditeRoutes from "@/components/EditeRoutes";
import AddRoute from "@/components/AddRoute";

const client = () => {
  const { t } = useTranslation("common");
  const [userInfo, setUserInfo] = useState(null);

  const [routesList, setRouteList] = useState([
    {
      routeTitle: "",
      data: [
        {
          color: "",
          latitude: "",
          longitude: "",
          markerInfo: {
            name: "",
            video: "",
            descriptionTitle: "",
            descriptionText: "",
          },
          markerName: "",
          reached: false,
          visible: true,
        },
      ],
    },
  ]);

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
        setRouteList(docSnap.data().routes);
        console.log(docSnap.data());
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [userInfo, setRouteList]);

  return (
    <IndexLayout>
      <div className="w-full  flex flex-col items-center  gap-3 bg-emerald-700 px-5">
        <div className="mb-16">
          <h1 className="text-3xl">{t("blankPage")}</h1>
        </div>
        <div>
          <Link href={`/client/${userInfo && userInfo.uid}`}>
            <span className="rounded bg-blue-500 hover:bg-blue-600 text-white py-3 px-5">
              Load Map
            </span>
          </Link>
        </div>
        <div>
          <div className="mb-5 max-w-[400px] px-5">
            <h1 className="mb-5">Client Info</h1>
            <p className="text-white">Client UID: {userInfo && userInfo.uid}</p>
            <p className="text-white">
              Client Email: {userInfo && userInfo.email}
            </p>
          </div>
          <AddRoute
            routesList={routesList}
            setRouteList={setRouteList}
            userInfo={userInfo}
          />
          <EditeRoutes
            routesList={routesList}
            setRouteList={setRouteList}
            userInfo={userInfo}
          />
        </div>
      </div>
    </IndexLayout>
  );
};

export default client;

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "routeForm"])),
  },
});
