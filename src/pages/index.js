import { useEffect, useState, useRef, useMemo, useCallback} from "react";
import mapboxgl from 'mapbox-gl';
import ReactMapGL, {
  Map,
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  Marker,
  Popup,
  ScaleControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { calculateDistance } from "@/utils/helpers";


const THRESHOLD = 10;

const Home = () => {


  // Initial Map settings<
  const [viewport, setViewport] = useState({
    longitude: 26.432730917247454,
    latitude: 55.60407906787367,
    zoom: 15,
  });


  const [currentMarker, setCurrentMarker] = useState({});




  const popupCloseManager = () => {
    setMarkerList(prev => {
      const temp = [...prev]
      temp.forEach((marker, idx) => {
        marker.reached = false
        if (idx === currentMarker.idx + 1) marker.visible = true;
        else marker.visible = false
      })
      return temp
    })
  }
  

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



  // GOOD
  const [distance, setDistance] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [markerList, setMarkerList] = useState([
    {
      visible: true,
      markerName: "Marker 1",
      latitude: 55.605714,
      longitude: 26.429418,
      reached: false,
      color: "red",
      markerInfo: {
        name: "Marker 1",
        descriptionTitle: "Marker 1 Reached!",
        descriptionText: "You have reached the marker.",
      },
    },
    {
      visible: false,
      markerName: "Marker 2",
      latitude: 55.604460,
      longitude: 26.427806,
      reached: false,
      color: "blue",
      markerInfo: {
        name: "Marker 2",
        descriptionTitle: "Marker 2 Reached!",
        descriptionText: "You have reached the marker.",
      },
    },  
    {
      visible: false,
      markerName: "Marker 3",
      latitude: 55.604293,
      longitude: 26.426167,
      reached: false,
      color: "green",
      markerInfo: {
        name: "Marker 3",
        descriptionTitle: "Marker 3 Reached!",
        descriptionText: "You have reached the marker.",
      },
    },  
    {
      visible: false,
      markerName: "Marker 4",
      latitude: 55.603554,
      longitude: 26.431648,
      reached: false,
      color: "yellow",
      markerInfo: {
        name: "Marker 4",
        descriptionTitle: "Marker 4 Reached!",
        descriptionText: "You have reached the marker.",
      },
    },
  ])


  const geoControlRef = useRef();

  const showReachedMarkerPopup = () => {
    setMarkerList(prev => {
      const temp = [...prev]
      temp[currentMarker.idx].reached = true;
      return temp
    })
  }

  const handleMove = () => {
    const isCoords = currentLocation.latitude !== 0 && currentLocation.longitude !== 0 && currentMarker.latitude && currentMarker.longitude
    
    if (isCoords) {
      const locatioToMarkerDistance = calculateDistance(currentLocation.latitude, currentLocation.longitude, currentMarker.latitude, currentMarker.longitude);
      setDistance(locatioToMarkerDistance);

      if (locatioToMarkerDistance < THRESHOLD) {
        showReachedMarkerPopup()
      }
    }
  };

  useEffect(() => {


    handleMove();
  }, [currentLocation, currentMarker]);

  useEffect(() => {

    const curentMarkerIdx = markerList.findIndex(obj => obj.visible === true);
    setCurrentMarker({
      idx: curentMarkerIdx,
      ...markerList.filter(marker => marker.visible)[0]
    }) 
  }, [markerList])

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

        <span onClick={showReachedMarkerPopup} style={{cursor: "pointer", background: 'darkcyan', padding: '10px 20px'}}>SHOW POPUP</span>
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
        <Map
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
          {markerList.map((marker, idx) => {
            if(marker.visible) return (
              <>
              <Marker
                key={marker.markerName}
                longitude={marker.longitude}
                latitude={marker.latitude}
                offsetTop={-20}
                offsetLeft={-10}
                draggable={true}
                color={marker.color}
              />
              {
                marker.reached && 
                <Popup
                  key={marker.markerName}
                  longitude={marker.longitude}
                  latitude={marker.latitude}
                  onClose={() => {popupCloseManager()}}
                >
                  <div key={marker.markerName}>
                    <h3>{marker.markerInfo.descriptionTitle}</h3>
                    <p>{marker.markerInfo.descriptionText}</p>
                    <button onClick={popupCloseManager} className="genry">SEE NEXT SIGHTSEEING</button>
                  </div>
                </Popup>
              }
              </>
            )
          })}

          {/* {popupVisible && (
            <Popup
              longitude={marker.longitude}
              latitude={marker.latitude}
              onClose={() => {
                setPopupVisible(false),
                  setMarker({
                    markerName: "Marker 2",
                    longitude: 27.4320152027781,
                    latitude: 58.60406394176819,
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
          )} */}
        </Map>
      </div>
    </div>
  );
};

export default Home;
