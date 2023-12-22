import React, {useState, useEffect, useRef} from 'react'
import {useGeolocation} from "@/hooks/UseGeolocation"
import "mapbox-gl/dist/mapbox-gl.css";
import { calculateDistance, showReachedMarkerPopup, popupCloseManager } from "@/utils/helpers";
import {THRESHOLD} from "@/data/constantas";
import {MapRouteBuilder} from "@/components/MapRouteBuilder"

import ReactMapGL, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  Marker,
  Popup
} from "react-map-gl";

export const MapComponent = ({selectedRoute, stopRoute}) => {
  const { currentLocation, error } = useGeolocation();
  const mapRef = useRef();


  const [mapZoom, setMapZoom] = useState(15);
  const [markerList, setMarkerList] = useState(selectedRoute.data);
  const [currentMarker, setCurrentMarker] = useState({});


  const [showRoutes, setShowRoutes] = useState([]);


  const [distance, setDistance] = useState(null);
  const [xyz, setXyz] = useState(0)


  const [viewport, setViewport] = useState({
    longitude: 26.432730917247454,
    latitude: 55.60407906787367,
    zoom: 2,
  });



  const geoControlRef = useRef();
  const handleGeolocate = () => {
    if (geoControlRef.current) {
      geoControlRef.current._onClickGeolocate();
    }
  };
  const handleMove = () => {
    const isCoords = currentLocation.latitude !== 0 && currentLocation.longitude !== 0 && currentMarker.latitude && currentMarker.longitude
    
    if (isCoords) {
      const locationToMarkerDistance = calculateDistance(currentLocation.latitude, currentLocation.longitude, currentMarker.latitude, currentMarker.longitude);
      setDistance(locationToMarkerDistance);

      if (locationToMarkerDistance < THRESHOLD) {
        showReachedMarkerPopup(setMarkerList)
      }
    }
  };
  const onMapLoad = () => {
    console.log('Map fully loaded');
    geoControlRef.current.trigger();
  };

  const showNavigationManager = () => {
    setShowRoutes(true)
  }


  useEffect(() => {
    const curentMarkerIdx = markerList?.findIndex(obj => obj.visible === true);
    setCurrentMarker({
      idx: curentMarkerIdx,
      ...markerList?.filter(marker => marker.visible)[0]
    }) 
  }, [markerList])

  useEffect(() => {
    handleMove();
  }, [currentLocation, currentMarker]);

  return (
        <div className='map-container'>
            <div className='absolute z-50 cursor-pointer text-lg' style={{color: "white", left: "6px", top: '4px', fontSize: '24px'}} onClick={stopRoute}>X</div>
            <div 
              className='absolute z-50 cursor-pointer text-lg' 
              style={{color: "white", left: "44px", top: '4px', fontSize: '24px'}} 
              onClick={showNavigationManager}
            >
                NAVIGATE
            </div>
            <ReactMapGL
              ref={mapRef} 
              {...viewport}
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              mapStyle="mapbox://styles/marius-dainys/clp87nlcx01tq01o4hv8ybcc1"
              attributionControl={false}
              onMove={(e) => setViewport(e.viewport)}
              onViewportChange={(newViewport) => {
                setViewport(newViewport);
                handleMove();
              }}
              onLoad={onMapLoad}
            >
              <GeolocateControl
                showAccuracyCircle={true}
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={true}
                showUserHeading
                ref={geoControlRef}
                fitBoundsOptions={{ zoom: mapZoom}}
                onClick={handleGeolocate}
              />
              <NavigationControl position='bottom-right' />
              <FullscreenControl />


              {markerList?.map((marker, idx) => {
                if(marker.visible) return (
                  <React.Fragment key={marker.markerName}>
                  <Marker
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
                      onClose={() => {popupCloseManager(setMarkerList)}}
                    >
                      <div key={marker.markerName}>
                        <h3>{marker.markerInfo.descriptionTitle}</h3>
                        <p>{marker.markerInfo.descriptionText}</p>
                        <button onClick={() => popupCloseManager(setMarkerList)} className="genry">SEE NEXT SIGHTSEEING</button>
                      </div>
                    </Popup>
                  }
                  </React.Fragment>
                )
              })}

              { 
                showRoutes 
                && 
                <MapRouteBuilder 
                  setShowRoutes={setShowRoutes} 
                  showRoutes={showRoutes} 
                  currentLocation={currentLocation}
                  currentMarker={currentMarker}
                />
              }

            </ReactMapGL>
          </div>

  );
}
