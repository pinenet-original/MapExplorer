import { useEffect, useState, useRef, useMemo, useCallback} from "react";
import { lineStyle } from "@/utils/geoJsonData";
import ReactMapGL, {
  Map,
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  Marker,
  Popup,
  Layer,
  Source,
  ScaleControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { calculateDistance } from "@/utils/helpers";


const THRESHOLD = 15;
const STEPS_THRESHOLD = 5;

const Home = () => {
  const [xyz, setXyz] = useState(0)

  //GOOOOOOOD

  // Initial Map settings
  const [mapZoom, setMapZoom] = useState(15);
  const [viewport, setViewport] = useState({
    longitude: 26.432730917247454,
    latitude: 55.60407906787367,
    zoom: 2,
  });
  const [distance, setDistance] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
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
  const [currentMarker, setCurrentMarker] = useState({});
  const [coords, setCoords] = useState([]);
  const [steps, setSteps] = useState([]);
  const [showRoutes, setShowRoutes] = useState([]);
  

  // Map Setup Functions
  const startPoint = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [...coords],
        },
      },
    ],
  };

  const geoControlRef = useRef();
  const handleGeolocate = () => {
    if (geoControlRef.current) {
      geoControlRef.current._onClickGeolocate();
    }
  };

  const getRoute = async () => {
    try {

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${[currentLocation.longitude, currentLocation.latitude].join(
          ","
        )};${[currentMarker.longitude,currentMarker.latitude].join(",")}?steps=true&walkway_bias=1&geometries=geojson&access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch route data");
      }

      const data = await response.json();
      const route = data.routes[0];

      setCoords(route.geometry.coordinates);

      setSteps(route.legs[0].steps.map((step) => step.maneuver.instruction));
      setShowRoutes(true)
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  const startNavigationModeManager = () => {
    getRoute()
  }

  const showReachedMarkerPopup = () => {
    setMarkerList(prev => {
      const temp = [...prev]
      temp[currentMarker.idx].reached = true;
      return temp
    })
  }

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

  const blueLineUpdateManager = () => {
    const isCoords = currentLocation.latitude !== 0 && currentLocation.longitude !== 0 && currentMarker.latitude && currentMarker.longitude && coords.length > 0
    if (isCoords) {
      const locatioToNextStepDistance = calculateDistance(currentLocation.latitude, currentLocation.longitude, coords[1][1], coords[1][0]);
      setXyz(locatioToNextStepDistance)

      if (locatioToNextStepDistance <= STEPS_THRESHOLD) {
        setCoords(prev => {
          return [...prev].splice(1)
        })
      }
    }
  }

  useEffect(() => {
    handleMove();
    blueLineUpdateManager()
  }, [currentLocation, currentMarker]);

  useEffect(() => {

    const curentMarkerIdx = markerList.findIndex(obj => obj.visible === true);
    setCurrentMarker({
      idx: curentMarkerIdx,
      ...markerList.filter(marker => marker.visible)[0]
    }) 
  }, [markerList])

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

  useEffect(() => {
    // Activate as soon as the control is loaded
    geoControlRef.current?.trigger();
  }, [geoControlRef.current]);


  useEffect(() => {
    console.log(coords)
  }, [coords])

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
        <p>{xyz}</p>

        <div>
          <button 
            className="border border-blue-500 rounded-lg py-2 px-4 w-36 mt-4" 
            onClick={startNavigationModeManager} 
            style={{cursor: "pointer", background: 'darkcyan', padding: '10px 20px'}}>
          START NAVIGATION
          </button>
        </div>
        <div>
          <button 
            className="border border-blue-500 rounded-lg py-2 px-4 w-36 mx-8 mt-4" 
            onClick={blueLineUpdateManager} 
            style={{cursor: "pointer", background: 'darkcyan', padding: '10px 20px'}}>
          UPDATE BLUE LINE
          </button>
        </div>

      </div>

      <div
        style={{
          height: "40vh",
          display: "flex",
          width: '400px',
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <ReactMapGL
          style={{
            marginTop: "40px",
            width: "100%",
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
            fitBoundsOptions={{ zoom: mapZoom}}
            onClick={handleGeolocate}
          />
          {/* <ScaleControl /> */}
          <NavigationControl position="bottom-right" />
          <FullscreenControl />


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

          { showRoutes &&
            <>
              <Source id="routeSource" type="geojson" data={startPoint}>
                <Layer {...lineStyle} />
              </Source>

            </>
          }

        </ReactMapGL>
      </div>
    </div>
  );
};

export default Home;
