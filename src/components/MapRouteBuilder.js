import React, {useState, useEffect, useRef} from 'react'
import { lineStyle } from "@/utils/geoJsonData";
import {STEPS_THRESHOLD} from "@/data/constantas";
import {Layer, Source} from "react-map-gl";

export const MapRouteBuilder = ({ showRoutes, currentLocation, currentMarker}) => {
  const [coords, setCoords] = useState([]);
  const [steps, setSteps] = useState([]);

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
    } catch (error) {
      console.error("Error fetching route data:", error);
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
    getRoute()
  }, [showRoutes])


  return (
    <Source id="routeSource" type="geojson" data={startPoint}>
      <Layer {...lineStyle} />
    </Source>
  );
}