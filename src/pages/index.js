import Link from "next/link";

const Home = () => {
  return (
    <div className="w-full h-screen bg-emerald-700">
      <div className="w-96 mx-auto flex justify-between items-center  gap-3 mb-10">
        <p>
          <Link
            href="/login"
            className="rounded bg-blue-500 hover:bg-blue-600 text-white py-1 px-2"
          >
            Login
          </Link>
        </p>
        <p>
          <Link
            href="/register"
            className="rounded bg-blue-500 hover:bg-blue-600 text-white py-1 px-2"
          >
            Register
          </Link>
        </p>
      </div>
      <div className="w-96 mx-auto mb-10">
        <h1 className="text-7xl">MapExplorer</h1>
      </div>
      <div className="w-[900px] mx-auto flex flex-col items-center text-white">
        <h1 className="text-4xl text-white mb-5">
          🌟 Explore Visaginas: Your City Adventure Awaits! 🗺️
        </h1>

        <p className="mb-5">
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
