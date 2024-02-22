import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Cookie from "js-cookie";
import { useRouter } from "next/router";

const Home = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const auth = getAuth();
  const [logedIn, setLogedIn] = useState(null);

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
    <div className="w-full h-screen bg-emerald-700">
      <div className="max-w-lg mx-auto flex justify-center items-center  gap-3 mb-10 ">
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
          <div className="borer-2 w-[550px] flex justify-between">
            <button className=" rounded bg-[#50d71e] hover:bg-blue-600 text-white py-0 px-2">
              <Link href="/login">Log in</Link>
            </button>
            <button className=" rounded bg-[#50d71e] hover:bg-blue-600 text-white py-0 px-2">
              <Link href="/register">Register</Link>
            </button>
          </div>
        )}
      </div>
      <div className="max:w-96 mx-auto mb-10 flex justify-center">
        <h1 className="text-7xl max-sm:text-5xl">MapExplorer 2</h1>
      </div>
      <div className="max-sm:[200px]  px-5 mx-auto flex flex-col items-center text-white">
        <h1 className="text-4xl text-white mb-5">
          🌟 Explore Visaginas: Your City Adventure Awaits! 🗺️
        </h1>
        {t("hello")}
        <p className="mb-5 max-w-lg">
          Discover the essence of Visaginas through our curated routes. 🚶‍♂️ Let
          the interactive map guide you to iconic landmarks, hidden gems, and
          local hotspots. 📸 Capture breathtaking moments and savor local
          delights along the way. 🌈 Join us in celebrating the beauty of
          Visaginas - start your journey now! #ExploreVisaginas #CityAdventure
          🌆✨
        </p>
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});
