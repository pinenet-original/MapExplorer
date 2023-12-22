import { useEffect, useState} from "react";
import {RoutesList} from "@/components/RoutesList"
import {RouteDescriptor} from "@/components/RouteDescriptor"
import {MapComponent} from "@/components/MapComponent"
import {useGeolocation} from "@/hooks/UseGeolocation"



const Home = () => {
  const { currentLocation, error } = useGeolocation();
  
  const [selectedRoute, setSelectedRoute] = useState({})
  const [showMap, setShowMap] = useState(false)

  const routeSelectionManager = () => {
    return (
        selectedRoute.routeTitle ?
        <RouteDescriptor route={selectedRoute} currentLocation={currentLocation} setShowMap={setShowMap} />
        :
        <RoutesList routeSetter={setSelectedRoute}/>
    )
  }

  const stopRoute = () => {
    setShowMap(false);
    setSelectedRoute([])
  }

  return (
    <section className="h-screen ">
      {!showMap && <h1 className="pt-4 mb-6 text-center text-xl sm:text-2xl md:text-4xl lg:text-6xl">Visaginas Tourism Explorer</h1>}
      {
        showMap
        ? 
        <MapComponent selectedRoute={selectedRoute} stopRoute={stopRoute} />
        :
        routeSelectionManager()
      }
    </section>
  );
};

export default Home;
