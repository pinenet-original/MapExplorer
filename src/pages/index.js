import React, { useEffect, useState, useCallback } from "react";
import ReactMapGL, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapInfo from "@/components/MapInfo";

const Home = () => {
  const [viewport, setViewport] = useState({
    longitude: 26.432730917247454,
    latitude: 55.60407906787367,
    // center: [26.432730917247454, 55.60407906787367],
    zoom: 10,
  });
  const [currentLocation, setCurrentLocation] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [markerPosition, setMarkerPosition] = useState({
    longitude: 26.4277098,
    latitude: 55.6103488,
  });

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location:", error.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  return (
    <div style={{ width: "90vw", height: "80vh" }}>
      <MapInfo
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
      />

      <ReactMapGL
        {...viewport}
        onMove={(e) => setViewport(e.viewport)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/marius-dainys/clp87nlcx01tq01o4hv8ybcc1"
      >
        <GeolocateControl />
        <NavigationControl />
        <FullscreenControl />
        <Marker
          longitude={markerPosition.longitude}
          latitude={markerPosition.latitude}
        />
      </ReactMapGL>
    </div>
  );
};

export default Home;
