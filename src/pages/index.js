import React, { useEffect, useState } from "react";
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
    longitude: 26.4319901,
    latitude: 55.6040469,
  });
  const [distance, setDistance] = useState(0);
  const [approachAlertShown, setApproachAlertShown] = useState(false);

  const updateCurrentLocation = (position) => {
    setCurrentLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  };

  useEffect(() => {
    // Calculate distance whenever currentLocation changes
    const newDistance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      markerPosition.latitude,
      markerPosition.longitude
    );
    const threshold = 10;
    if (newDistance < threshold && !approachAlertShown) {
      setApproachAlertShown(true);
      alert("Marker approached!");
    } else if (newDistance >= threshold && approachAlertShown) {
      // Reset the flag when the distance is above the threshold again
      setApproachAlertShown(false);
    }

    // Update the distance state
    setDistance(newDistance);
  }, [currentLocation, markerPosition]);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        const options = { enableHighAccuracy: true };

        const watchId = navigator.geolocation.watchPosition(
          updateCurrentLocation,
          (error) => {
            console.error("Error getting location:", error.message);
          },
          options
        );

        // Cleanup the watchPosition when the component unmounts
        return () => navigator.geolocation.clearWatch(watchId);
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  return (
    <div
      style={{
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div>
        <h1 style={{ color: "red" }}>Map Explorer</h1>
        <MapInfo
          latitude={currentLocation.latitude}
          longitude={currentLocation.longitude}
          distance={distance}
        />
      </div>
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
          style={{ marginTop: "40px", width: "300px" }}
          {...viewport}
          onMove={(e) => setViewport(e.viewport)}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/marius-dainys/clp87nlcx01tq01o4hv8ybcc1"
        >
          <GeolocateControl />
          <NavigationControl position="bottom-right" />
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
