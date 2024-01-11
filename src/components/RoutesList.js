import styles from "@/styles/components/routeList.module.scss";
import { route1, route2, listOfRoutes } from "@/data/routes";

export const RoutesList = ({ routeSetter, routes }) => {
  const routeSelectManager = (idx) => {
    routeSetter(listOfRoutes[idx]);
  };

  return (
    <div className={styles.routeListSelector}>
      {routes.map((route, idx) => {
        return (
          // <button key={route.routeTitle} onClick={()=> {routeSelectManager(idx)}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">{`Select Route No` + (idx+1)}</button>
          <button
            key={route.routeTitle}
            onClick={() => {
              routeSelectManager(idx);
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            {route.routeTitle}
          </button>
        );
      })}
    </div>
  );
};
