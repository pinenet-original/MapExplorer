import React, { useState, useEffect, useRef } from "react";
import { lineStyle } from "@/utils/geoJsonData";
import { STEPS_THRESHOLD } from "@/data/constantas";
import { Layer, Source, GeolocateControl } from "react-map-gl";
import { calculateDistance } from "@/utils/helpers";
import Instruction from "./Instruction";

export const MapRouteBuilder = ({
  showRoutes,
  currentLocation,
  currentMarker,
}) => {
  const [coords, setCoords] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [distanceToNextStep, setDistanceToNextStep] = useState([]);
  const [xyz, setXyz] = useState(0);
  const [maneuverLocation, setManeuverLocation] = useState("");

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
        `https://api.mapbox.com/directions/v5/mapbox/walking/${[
          currentLocation.longitude,
          currentLocation.latitude,
        ].join(",")};${[currentMarker.longitude, currentMarker.latitude].join(
          ","
        )}?steps=true&walkway_bias=1&geometries=geojson&access_token=${
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
      setManeuverLocation(route.legs[0].steps[0].maneuver.location);
      setDistanceToNextStep(route.legs[0].steps[0].distance);
      console.log(route.legs);
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  const blueLineUpdateManager = () => {
    const isCoords =
      currentLocation.latitude !== 0 &&
      currentLocation.longitude !== 0 &&
      currentMarker.latitude &&
      currentMarker.longitude &&
      coords.length > 0;
    if (isCoords) {
      const locatioToNextStepDistance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        coords[1][1],
        coords[1][0]
      );
      setXyz(locatioToNextStepDistance);

      if (locatioToNextStepDistance <= STEPS_THRESHOLD) {
        setCoords((prev) => {
          return [...prev].splice(1);
        });
      }
    }
  };

  useEffect(() => {
    getRoute();
  }, [showRoutes]);

  useEffect(() => {
    const onGeolocate = (e) => {
      const userLocation = [e.coords.longitude, e.coords.latitude];
      const { longitude, latitude } = e.coords;

      // Update start coordinates with user's current location
      setStart(userLocation);

      // Use the latest steps state
      const currentStep = steps[currentStepIndex];

      const distanceToNextStep = calculateDistance(
        userLocation,
        currentStep.location.coordinates
      );

      setDistanceToNextStep(distanceToNextStep);

      // Adjust the threshold for step completion to 10 meters
      if (distanceToNextStep < 10) {
        setCurrentStepIndex((prevIndex) =>
          Math.min(prevIndex + 1, steps.length - 1)
        );
      }
    };

    GeolocateControl.current?.on("geolocate", onGeolocate);

    return () => {
      GeolocateControl.current?.off("geolocate", onGeolocate);
    };
  }, [currentStepIndex, steps]);

  return (
    <>
      <div
        className="absolute z-50 text-lg"
        style={{
          color: "white",
          left: "5px",
          top: "180px",
          fontSize: "24px",
        }}
      >
        {steps.length > 0 && (
          <Instruction instruction={steps[currentStepIndex]} />
        )}
        To next step: {distanceToNextStep}m
      </div>
      <Source id="routeSource" type="geojson" data={startPoint}>
        <Layer {...lineStyle} />
      </Source>
    </>
  );
};
