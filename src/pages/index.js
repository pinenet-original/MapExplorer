import { useState} from "react";
import {RoutesList} from "@/components/RoutesList"
import {RouteDescriptor} from "@/components/RouteDescriptor"
import {MapComponent} from "@/components/MapComponent";
import { AppTitle } from "@/components/AppTitle";
import {useGeolocation} from "@/hooks/UseGeolocation"

const Home = () => {
  const { currentLocation, error } = useGeolocation();
  
  const [selectedRoute, setSelectedRoute] = useState({})
  const [showMap, setShowMap] = useState(false)

  const routeSelectionManager = () => {
    return (
      <>
        <AppTitle/>
        {
          selectedRoute?.routeTitle ?
          <RouteDescriptor 
            route={selectedRoute} 
            currentLocation={currentLocation} 
            setShowMap={setShowMap} 
            routeSetter={setSelectedRoute} 
          />
          :
          <RoutesList routeSetter={setSelectedRoute}/>
        }
      </>
    )
  }

  const stopRoute = () => {
    setShowMap(false);
    setSelectedRoute([])
  }

  return (
    <section className="h-screen ">
      {
        showMap
        ? 
        <MapComponent selectedRoute={selectedRoute} stopRoute={stopRoute} setShowMap={setShowMap} />
        :
        routeSelectionManager()
      }
    </section>
  );
};

export default Home;
