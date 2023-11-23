import React, { useEffect, useState, useCallback } from "react";
import ReactMapGL, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapInfo from "@/components/MapInfo";
import { calculateDistance } from "@/utils/helpers";

const Home = () => {
  const [viewport, setViewport] = useState({
    longitude: 26.432730917247454,
    latitude: 55.60407906787367,
    zoom: 15,
  });
  const [currentLocation, setCurrentLocation] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [markerPosition, setMarkerPosition] = useState({
    longitude: 26.427082983048223,
    latitude: 55.60809820197926,
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
  const distance = calculateDistance(
    currentLocation.latitude,
    currentLocation.longitude,
    markerPosition.latitude,
    markerPosition.longitude
  );

  return (
    <div
      style={{
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        maxWidth: "100%",
        border: "solid 1px red",
      }}
    >
      <h1>Map Explorer</h1>
      <MapInfo
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
        distance={distance}
      />

      <div
        style={{
          height: "40vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <ReactMapGL
          style={{ border: "solid 1px red", marginTop: "40px", width: "300px" }}
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
    </div>
  );
};

export default Home;
