import { useEffect, useState, useRef } from "react";
import ReactMapGL, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  Marker,
  Popup,
  ScaleControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { calculateDistance } from "@/utils/helpers";

const Home = () => {
  const geoControlRef = useRef();

  // Initial Map settings
  const [viewport, setViewport] = useState({
    longitude: 26.432730917247454,
    latitude: 55.60407906787367,
    zoom: 15,
  });

  const [currentLocation, setCurrentLocation] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [distance, setDistance] = useState(null);
  const [approachAlertShown, setApproachAlertShown] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  const [marker, setMarker] = useState({
    markerName: "Marker 1",
    longitude: 26.4320152027785,
    latitude: 55.60406394176823,
    reached: false,
    color: "#42b883",
    markerInfo: {
      name: "Marker 1",
      descriptionTitle: "Marker Reached!",
      descriptionText: "You have reached the marker.",
    },
  });

  const handleGeolocate = () => {
    if (geoControlRef.current) {
      geoControlRef.current._onClickGeolocate();
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          // setViewport((prevViewport) => ({
          //   ...prevViewport,
          //   longitude,
          //   latitude,
          // }));
          setCurrentLocation({ longitude, latitude });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []);

  useEffect(() => {
    const handleMove = () => {
      // Check if both currentLocation and marker have valid coordinates
      if (
        currentLocation.latitude !== 0 &&
        currentLocation.longitude !== 0 &&
        marker.latitude &&
        marker.longitude
      ) {
        const newDistance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          marker.latitude,
          marker.longitude
        );
        setDistance(newDistance);

        const threshold = 50;
        if (newDistance < threshold && !approachAlertShown) {
          setApproachAlertShown(true);
          setPopupVisible(true);
        } else if (newDistance >= threshold && approachAlertShown) {
          setApproachAlertShown(false);
          setPopupVisible(false);
        }
      }
    };

    handleMove();
  }, [currentLocation, approachAlertShown, marker, popupVisible]);

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
        <h1 className="text-6xl mb-20 text-[#50d71e] ">Map Explorer</h1>
        Current Location: {currentLocation.latitude.toFixed(6)},{" "}
        {currentLocation.longitude.toFixed(6)}
        <p>Distance between Marker and Current Location:</p>
        <p>{distance}</p>
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
          style={{
            marginTop: "40px",
            width: "400px",
            borderRadius: "15px",
            boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.75)",
          }}
          {...viewport}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/marius-dainys/clp87nlcx01tq01o4hv8ybcc1"
          attributionControl={false}
          onMove={(e) => setViewport(e.viewport)}
          onViewportChange={(newViewport) => {
            setViewport(newViewport);
            handleMove();
          }}
        >
          <GeolocateControl
            showAccuracyCircle={false}
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            showUserHeading
            ref={geoControlRef}
            fitBoundsOptions={{ zoom: 20, pitch: 70 }}
            onClick={handleGeolocate}
          />
          <ScaleControl />
          <NavigationControl position="bottom-right" />
          <FullscreenControl />

          {/* Marker */}
          <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}
            offsetTop={-20}
            offsetLeft={-10}
            draggable={true}
            color={marker.color}
          />
          {popupVisible && (
            <Popup
              longitude={marker.longitude}
              latitude={marker.latitude}
              onClose={() => {
                setPopupVisible(false),
                  setMarker({
                    markerName: "Marker 2",
                    longitude: 26.4320152027781,
                    latitude: 55.60406394176819,
                    reached: false,
                    color: "#FFC0CB",
                    markerInfo: {
                      name: " Marker 2",
                      descriptionTitle: "HELLO",
                      descriptionText: "Reached Marker 2",
                    },
                  });
              }}
            >
              <div>
                <h3>{marker.markerInfo.descriptionTitle}</h3>
                <p>{marker.markerInfo.descriptionText}</p>
              </div>
            </Popup>
          )}
        </ReactMapGL>
      </div>
    </div>
  );
};

export default Home;
