import { useState, useEffect } from "react";

export const useGeolocation = () => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    let watchId;

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setCurrentLocation({ longitude, latitude });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setError(error);
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return { currentLocation, error };
};
