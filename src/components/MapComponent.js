import React, { useState, useEffect, useRef } from "react";
import { useGeolocation } from "@/hooks/UseGeolocation";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  calculateDistance,
  showReachedMarkerPopup,
  popupCloseManager,
} from "@/utils/helpers";
import { THRESHOLD } from "@/data/constantas";
import { MapRouteBuilder } from "@/components/MapRouteBuilder";
import { MapMarkers } from "@/components/MapMarkers";

import ReactMapGL, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl";

export const MapComponent = ({ selectedRoute, stopRoute, setShowMap }) => {
  const { currentLocation, error } = useGeolocation();
  const mapRef = useRef();
  const geoControlRef = useRef();
  const [viewport, setViewport] = useState({
    longitude: 26.432730917247454,
    latitude: 55.60407906787367,
    zoom: 1,
    bearing: 0,
    duration: 0,
  });
  const [mapZoom, setMapZoom] = useState(15);
  const [markerList, setMarkerList] = useState(selectedRoute.data);
  const [currentMarker, setCurrentMarker] = useState({});
  const [showRoutes, setShowRoutes] = useState(false);
  const [distance, setDistance] = useState(null);
  const [map, setMap] = useState(null);
  const [navigationPadding, setNavigationPadding] = useState({
    top: 0,
  });
  const [bearing, setBearing] = useState(0);

  const zoomToCurrentLocation = () => {
    if (geoControlRef.current) {
      mapRef.current.easeTo({
        zoom: 20,
        pitch: 0,
        duration: 2000,
      });
      geoControlRef.current.trigger();
      geoControlRef.current.options.fitBoundsOptions.zoom = 20;
      setNavigationPadding({
        top: 500,
      });
    }
  };

  const handleMove = () => {
    const isCoords =
      currentLocation.latitude !== 0 &&
      currentLocation.longitude !== 0 &&
      currentMarker.latitude &&
      currentMarker.longitude;

    if (isCoords) {
      const locationToMarkerDistance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        currentMarker.latitude,
        currentMarker.longitude
      );
      setDistance(locationToMarkerDistance);

      if (locationToMarkerDistance < THRESHOLD) {
        showReachedMarkerPopup(setMarkerList, currentMarker);
      }
    }
  };

  const onMapLoad = () => {
    console.log("Map fully loaded");
    geoControlRef.current.trigger();
    setMap(mapRef.current.getMap());
  };

  const showNavigationManager = () => {
    setShowRoutes((prevShowRoutes) => !prevShowRoutes);
    setViewport((prevViewport) => {
      if (!showRoutes) {
        zoomToCurrentLocation();
      } else {
        mapRef.current.easeTo({
          zoom: 15,
          pitch: 0,
          duration: 2000,
        });
        return {
          ...prevViewport,
        };
      }
    });
  };

  const NavigateTo = () => {
    if (mapRef.current) {
      map.panTo([26.4434393, 55.5986873], {
        duration: 2000,
        zoom: 15,
      });
    }
  };

  useEffect(() => {
    const curentMarkerIdx = markerList?.findIndex(
      (obj) => obj.visible === true
    );
    setCurrentMarker({
      idx: curentMarkerIdx,
      ...markerList?.filter((marker) => marker.visible)[0],
    });
  }, [markerList]);

  useEffect(() => {
    if (currentMarker.reached) return;
    handleMove();
  }, [currentLocation, currentMarker]);

  return (
    <div className="map-container">
      <div
        id="mapId"
        className="absolute z-50 cursor-pointer text-lg rounded bg-blue-500 hover:bg-blue-600 text-white py-0 px-1"
        style={{ color: "white", left: "5px", top: "4px", fontSize: "24px" }}
        onClick={stopRoute}
      >
        X
      </div>
      <div
        className="absolute z-50 cursor-pointer text-lg mb-4 rounded bg-blue-500 hover:bg-blue-600 text-white py-0 px-1"
        style={{ color: "white", left: "5px", top: "40px", fontSize: "24px" }}
        onClick={showNavigationManager}
      >
        {showRoutes ? "Stop Navigation" : "Navigate"}
      </div>

      {showRoutes && (
        <>
          <div
            className="absolute z-50 text-lg"
            style={{
              color: "white",
              left: "5px",
              top: "80px",
              fontSize: "24px",
            }}
          >
            Destination : {markerList[0].markerName}
          </div>
          <div
            className="absolute z-50 text-lg"
            style={{
              color: "white",
              left: "5px",
              top: "120px",
              fontSize: "24px",
            }}
          >
            Distance: {distance}m
          </div>
        </>
      )}
      <div
        onClick={NavigateTo}
        className="absolute z-50 text-lg"
        style={{
          color: "white",
          left: "5px",
          top: "320px",
          fontSize: "24px",
          cursor: "pointer",
        }}
      >
        Move to Marker
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
        padding={navigationPadding}
      >
        <GeolocateControl
          showAccuracyCircle={false}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserHeading
          fitBoundsOptions={{ zoom: mapZoom }}
          ref={geoControlRef}
        />
        <NavigationControl position="bottom-right" />
        <FullscreenControl />

        {markerList && (
          <MapMarkers
            markerList={markerList}
            setMarkerList={setMarkerList}
            currentMarker={currentMarker}
            setShowMap={setShowMap}
          />
        )}

        {showRoutes && (
          <MapRouteBuilder
            // need to pass setBearing to MapRouteBuilder component to update bearing state in MapRouteBuilder component and later use it to update the map bearing
            setBearing={setBearing}
            setShowRoutes={setShowRoutes}
            showRoutes={showRoutes}
            currentLocation={currentLocation}
            currentMarker={currentMarker}
          />
        )}
      </ReactMapGL>
    </div>
  );
};
