import React, { useEffect, useState, useRef } from "react";
import ReactMapGL, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  Marker,
  Source,
  Layer,
} from "react-map-gl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapInfo from "@/components/MapInfo";
import { calculateDistance } from "@/utils/helpers";
import { lineStyle } from "@/utils/geoJsonData";

const Home = () => {
  const geoControlRef = useRef();

  // map's starting point
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

  const [start, setStart] = useState([26.432730917247454, 55.60407906787367]);
  const [end, setEnd] = useState([26.44709, 55.59473]);
  const [coords, setCoords] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showDirection, setShowDirection] = useState(false);

  const getRoute = async () => {
    try {
      setIsFetching(true);

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${start.join(
          ","
        )};${end.join(",")}?steps=true&geometries=geojson&access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch route data");
      }

      const data = await response.json();
      const coords = data.routes[0].geometry.coordinates;
      setCoords(coords);
    } catch (error) {
      console.error("Error fetching route data:", error);
    } finally {
      setIsFetching(false);
    }
  };
  const handleClick = (e) => {
    const newEnd = e.lngLat;
    const endPoint = Object.keys(newEnd).map((item, i) => newEnd[item]);
    setEnd(endPoint);
  };

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "feature",
        geometry: {
          type: "LineString",
          coordinates: [...coords],
        },
      },
    ],
  };

  useEffect(() => {
    if (showDirection) {
      getRoute();
    }
  }, [showDirection, start, end]);

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
    setStart([position.coords.longitude, position.coords.latitude]);
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
        <button
          style={{
            border: "solid 1px blue",
            borderRadius: "15px",
            width: "150px",
          }}
          onClick={() => setShowDirection(!showDirection)}
        >
          {showDirection ? "Hide Direction" : "Show Direction"}
        </button>
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
          onClick={handleClick}
        >
          //MapsBox Map Controls
          <GeolocateControl
            showAccuracyCircle={false}
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            ref={geoControlRef}
            onGeolocate={handleGeolocate}
            onViewportChange={(e) => setViewport(e.viewport)}
            fitBoundsOptions={{ zoom: 17 }}
          />
          <NavigationControl position="bottom-right" />
          <FullscreenControl />
          {/* <Marker
            longitude={markerPosition.longitude}
            latitude={markerPosition.latitude}
          /> */}
          //Direction's Source
          {showDirection && !isFetching && (
            <Source id="routeSource" type="geojson" data={geojson}>
              <Layer {...lineStyle} />
            </Source>
          )}
          <Marker longitude={start[0]} latitude={start[1]} />
          <Marker longitude={end[0]} latitude={end[1]} />
        </ReactMapGL>
      </div>
    </div>
  );
};

export default Home;
