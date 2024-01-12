import { getClient } from "@/utils/dataGetters";
import { useState } from "react";
import { RoutesList } from "@/components/RoutesList";
import { RouteDescriptor } from "@/components/RouteDescriptor";
import { MapComponent } from "@/components/MapComponent";
import { AppTitle } from "@/components/AppTitle";
import { useGeolocation } from "@/hooks/UseGeolocation";

export const getServerSideProps = async ({ params }) => {
  return { props: { clientData: (await getClient(params.id)) || null } };
};

export default function ClientPage({ clientData }) {
  const { currentLocation, error } = useGeolocation();

  const [selectedRoute, setSelectedRoute] = useState({});
  const [showMap, setShowMap] = useState(false);
  console.log(clientData);

  // const routeSelectionManager = () => {
  //   return (
  //     <>
  //       <AppTitle />
  //       {selectedRoute?.routeTitle ? (
  //         <RouteDescriptor
  //           route={selectedRoute}
  //           currentLocation={currentLocation}
  //           setShowMap={setShowMap}
  //           routeSetter={setSelectedRoute}
  //         />
  //       ) : (
  //         <RoutesList
  //           routeSetter={setSelectedRoute}
  //           routes={clientData.routes}
  //         />
  //       )}
  //     </>
  //   );
  // };

  const stopRoute = () => {
    setShowMap(false);
    setSelectedRoute([]);
  };

  return (
    <div>
      {clientData ? (
        <div>
          <h1>{clientData.name}</h1>
          <section className="h-screen ">
            {showMap ? (
              <MapComponent
                selectedRoute={selectedRoute}
                stopRoute={stopRoute}
                setShowMap={setShowMap}
              />
            ) : (
              <>
                <AppTitle />
                {selectedRoute?.routeTitle ? (
                  <RouteDescriptor
                    route={selectedRoute}
                    currentLocation={currentLocation}
                    setShowMap={setShowMap}
                    routeSetter={setSelectedRoute}
                  />
                ) : (
                  <RoutesList
                    routeSetter={setSelectedRoute}
                    routes={clientData.routes}
                  />
                )}
              </>
            )}
          </section>
        </div>
      ) : (
        <div>THIS IS ERROR BLOCK</div>
      )}
    </div>
  );
}
