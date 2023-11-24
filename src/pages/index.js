import React, { useEffect, useState, useRef } from "react";
import ReactMapGL, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  Marker,
} from "react-map-gl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapInfo from "@/components/MapInfo";
import { calculateDistance } from "@/utils/helpers";

const Home = () => {
  const geoControlRef = useRef();

  //map's starting point
  const [viewport, setViewport] = useState({
    longitude: 26.432730917247454,
    latitude: 55.60407906787367,
    zoom: 15,
  });

  const [currentLocation, setCurrentLocation] = useState({
    longitude: "",
    latitude: "",
  });

  const [distance, setDistance] = useState(0);
  const [approachAlertShown, setApproachAlertShown] = useState(false);

  const [markerPosition, setMarkerPosition] = useState({
    longitude: 26.4318921,
    latitude: 55.6040879,
  });

  const updateCurrentLocation = (position) => {
    setCurrentLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  };

  const handleViewportChange = (newViewport) => {
    setViewport(newViewport);
  };

  const handleGeolocate = (position) => {
    updateCurrentLocation(position);
    handleViewportChange((prevViewport) => ({
      ...prevViewport,
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
    }));
  };

  useEffect(() => {
    const setupGeolocateControl = () => {
      const geolocateControl = new mapboxgl.GeolocateControl({
        showUserHeading: true,
      });

      geolocateControl.on("geolocate", (event) => {
        const { longitude, latitude } = event.coords;
        setCurrentLocation({ longitude, latitude });
        setViewport((prevViewport) => ({
          ...prevViewport,
          longitude,
          latitude,
        }));
      });

      return geolocateControl;
    };

    const geolocateControl = setupGeolocateControl();

    geoControlRef.current = geolocateControl;
  }, []);

  useEffect(() => {
    const newDistance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      markerPosition.latitude,
      markerPosition.longitude
    );

    const checkApproachAlert = () => {
      const threshold = 10;
      if (newDistance < threshold && !approachAlertShown) {
        setApproachAlertShown(true);
        alert("Marker approached!");
      } else if (newDistance >= threshold && approachAlertShown) {
        setApproachAlertShown(false);
      }
    };

    checkApproachAlert();
    setDistance(newDistance);
  }, [currentLocation, markerPosition, approachAlertShown]);

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
          style={{ marginTop: "40px", width: "400px" }}
          {...viewport}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/marius-dainys/clp87nlcx01tq01o4hv8ybcc1"
          attributionControl={false}
          onViewportChange={handleViewportChange}
          onMove={(e) => setViewport(e.viewport)}
        >
          //MapsBox Map Controls
          <GeolocateControl
            showAccuracyCircle={false}
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            ref={geoControlRef}
            onGeolocate={handleGeolocate}
            onViewportChange={(e) => setViewport(e.viewport)}
            fitBoundsOptions={{ maxZoom: 20 }}
          />
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
